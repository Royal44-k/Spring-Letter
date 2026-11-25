import * as THREE from 'three';

/** An original, low-cost horizon: warm air below, cool open sky above. */
export function createAtmosphere(){
 const material=new THREE.ShaderMaterial({
  side:THREE.BackSide,depthWrite:false,depthTest:false,toneMapped:true,
  uniforms:{uNight:{value:0},uDust:{value:0},uTime:{value:0}},
  vertexShader:`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`
   varying vec3 vDirection;uniform float uNight;uniform float uDust;uniform float uTime;
   float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
   void main(){
    vec3 d=normalize(vDirection);float h=smoothstep(-.12,.8,d.y);
    vec3 day=mix(vec3(.63,.48,.48),vec3(.25,.32,.46),h);
    day=mix(day,vec3(.35,.42,.46),(1.-smoothstep(-.38,-.02,d.y)));
    float sun=pow(max(dot(d,normalize(vec3(-.65,.24,-.7))),0.),100.);
    day+=vec3(.56,.3,.13)*sun*.5;
    vec3 night=mix(vec3(.075,.045,.11),vec3(.014,.019,.055),h);
    vec3 grid=floor(d*480.);float spark=step(.9992,hash(grid));
    night+=spark*pow(max(d.y,0.),.4)*(.32+.16*sin(uTime*.3+hash(grid+2.)*20.))*vec3(.7,.8,1.);
    vec3 color=mix(day,night,uNight);color=mix(color,vec3(.0025,.0015,.006),uDust);
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`
 });
 const object=new THREE.Mesh(new THREE.SphereGeometry(140,24,16),material);object.name='the-weather-between-letters';object.renderOrder=-1000;object.frustumCulled=false;
 return {object,update(time,camera,night,dust){object.position.copy(camera.position);material.uniforms.uTime.value=time;material.uniforms.uNight.value=night;material.uniforms.uDust.value=dust;},dispose(){object.geometry.dispose();material.dispose();}};
}
