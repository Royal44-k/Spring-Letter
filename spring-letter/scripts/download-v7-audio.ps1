$ErrorActionPreference = 'Stop'
$target = Join-Path $PSScriptRoot '../.tools/v7-audio/raw'
New-Item -ItemType Directory -Force $target | Out-Null
$files = @{
 'harp-low.wav' = 'Strings/Harp/KSHarp_C3_mf.wav'
 'harp-high.wav' = 'Strings/Harp/KSHarp_C5_mf.wav'
 'piano.wav' = 'Keys/Upright Nr1/UR1_C4_pp_RR1.wav'
 'flute.wav' = 'Woodwinds/Flute/susvib/LDFlute_susvib_C4_v1_1.wav'
 'cello.wav' = 'Strings/Cello Section/susvib/susvib_C3_v1_1.wav'
 'pizz.wav' = 'Strings/Cello Section/pizzT/pizzT_C3_v1_RR1.wav'
 'triangle.wav' = 'Percussion/temp/Triangle6-Hit_v1_rr1_Sum.wav'
 'LICENSE.txt' = 'LICENSE'
 'README.txt' = 'Readme.txt'
}
$records = foreach ($file in $files.GetEnumerator()) {
 $encoded = ($file.Value.Split('/') | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/'
 $url = 'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master/' + $encoded
 $destination = Join-Path $target $file.Key
 if (-not (Test-Path -LiteralPath $destination)) { Invoke-WebRequest -Uri $url -OutFile $destination }
 [pscustomobject]@{ file=$file.Key; path=$file.Value; url=$url; bytes=(Get-Item -LiteralPath $destination).Length; sha256=(Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant() }
}
$records | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $target '../download-manifest.json') -Encoding utf8
$records | Select-Object file,bytes
