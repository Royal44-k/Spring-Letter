$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$candidatePath = [IO.Path]::GetFullPath((Join-Path $projectRoot '.qa-v6/candidate-g'))
$releasePath = [IO.Path]::GetFullPath((Join-Path $projectRoot 'dist'))
$stagingPath = [IO.Path]::GetFullPath((Join-Path $projectRoot '.qa-v6/release-ready-g'))
$archivePath = [IO.Path]::GetFullPath((Join-Path $projectRoot ('.history/dist-before-v6-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))))
# Every recursive copy/move remains inside this explicitly named game project.
foreach ($checkedPath in @($candidatePath, $releasePath, $stagingPath, $archivePath)) {
    if (-not $checkedPath.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Unexpected promotion path: $checkedPath"
    }
}
if (-not (Test-Path -LiteralPath (Join-Path $candidatePath 'index.html'))) { throw 'Missing final candidate' }
if (Test-Path -LiteralPath $stagingPath) { throw 'Staging path already exists; inspect it instead of overwriting' }
if (Test-Path -LiteralPath $archivePath) { throw 'Backup path already exists' }
$expected = Get-Content -LiteralPath (Join-Path $projectRoot 'evidence/v6-build-candidate-g.json') -Raw | ConvertFrom-Json
$soak = Get-Content -LiteralPath (Join-Path $projectRoot 'evidence/v6-soak.json') -Raw | ConvertFrom-Json
$video = Get-Content -LiteralPath (Join-Path $projectRoot 'evidence/v6-recording-verification.json') -Raw | ConvertFrom-Json
$decoded = Get-Content -LiteralPath (Join-Path $projectRoot 'evidence/v6-media-decoding.json') -Raw | ConvertFrom-Json
$styles = @($expected.dist | Where-Object { $_.path -match '^assets/[^/]+\.css$' })
if ($styles.Count -ne 1) { throw 'Expected one unambiguous candidate stylesheet' }
$expectedStyle = '/' + $styles[0].path
if (-not $soak.passed -or $soak.elapsedMs -lt 2700000 -or $soak.build -ne $expected.entry) { throw 'Final long run has not passed' }
if ($soak.styleBuild -ne $expectedStyle -or $soak.finalStyleBuild -ne $expectedStyle -or $soak.errors.Count -ne 0) { throw 'Final long run stylesheet or errors differ' }
if (-not $video.success -or -not $video.uncut -or $video.audioRecorded -ne $false -or $video.errors.Count -ne 0) { throw 'Final continuous journey has not passed' }
foreach ($report in @($video, $decoded)) {
    if ($report.build.entry -ne $expected.entry -or $report.build.finalEntry -ne $expected.entry -or $report.build.styleBuild -ne $expectedStyle -or $report.build.finalStyleBuild -ne $expectedStyle) { throw 'Recording or decoder belongs to another JS/CSS candidate' }
    $entryAsset = @($expected.dist | Where-Object { ('/' + $_.path) -eq $expected.entry })
    if ($entryAsset.Count -ne 1 -or $report.build.entrySha256 -ne $entryAsset[0].sha256 -or $report.build.styleSha256 -ne $styles[0].sha256) { throw 'Recording asset bytes differ from candidate' }
}
if (-not $decoded.passed -or -not $decoded.timestampsStrictlyIncreasing -or $decoded.decodedFrames -le 1000 -or $decoded.audioStreams -ne 0) { throw 'Complete silent recording decode has not passed' }
if (-not $video.file -or [IO.Path]::GetFileName($video.file) -ne $video.file) { throw 'Unsafe recording filename' }
$videoPath = [IO.Path]::GetFullPath((Join-Path $projectRoot ('evidence/' + $video.file)))
if (-not $videoPath.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Recording path escapes project' }
$videoHash = (Get-FileHash -LiteralPath $videoPath -Algorithm SHA256).Hash.ToLowerInvariant()
$reportHash = (Get-FileHash -LiteralPath (Join-Path $projectRoot 'evidence/v6-recording-verification.json') -Algorithm SHA256).Hash.ToLowerInvariant()
if ($decoded.file -ne $video.file -or $decoded.bytes -ne $video.fileBytes -or (Get-Item -LiteralPath $videoPath).Length -ne $video.fileBytes -or $video.fileBytes -le 1000) { throw 'Recording file/size binding differs' }
if ($video.fileSha256 -ne $videoHash -or $decoded.sha256 -ne $videoHash -or $decoded.recordingReportSha256 -ne $reportHash) { throw 'Recording or decoder SHA binding differs' }
Copy-Item -LiteralPath $candidatePath -Destination $stagingPath -Recurse
if ((Get-ChildItem -LiteralPath $stagingPath -File -Recurse).Count -ne $expected.dist.Count) { throw 'Staged file set differs' }
foreach ($entry in $expected.dist) {
    $copiedPath = Join-Path $stagingPath $entry.path
    if ((Get-FileHash -LiteralPath $copiedPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $entry.sha256) { throw ('Staged bytes differ: ' + $entry.path) }
}
if (Test-Path -LiteralPath $releasePath) { Move-Item -LiteralPath $releasePath -Destination $archivePath }
try { Move-Item -LiteralPath $stagingPath -Destination $releasePath }
catch {
    if ((-not (Test-Path -LiteralPath $releasePath)) -and (Test-Path -LiteralPath $archivePath)) { Move-Item -LiteralPath $archivePath -Destination $releasePath }
    throw
}
[pscustomobject]@{ release = $releasePath; backup = $archivePath; build = $expected.entry; styleBuild = $expectedStyle; videoSha256 = $videoHash } | ConvertTo-Json

