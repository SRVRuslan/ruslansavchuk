// A ray-cast sphere keeps the globe sharp without a mesh or a 3D dependency.
const vertexSource = `
attribute vec2 a_position;
varying vec2 v_position;
void main() {
  v_position = a_position;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentSource = `
precision highp float;
varying vec2 v_position;
uniform sampler2D u_surface;
uniform sampler2D u_night;
uniform sampler2D u_borders;
uniform vec2 u_rotation;
uniform vec2 u_tilt;
uniform float u_feather;
const float PI = 3.14159265359;
void main() {
  vec2 p = v_position / .87;
  float distance = length(p);
  float upper = .7 + .3 * clamp(p.y * .5 + .5, 0.0, 1.0);
  float dawn = exp(-pow(p.x * 8.0, 2.0) - pow((p.y - 1.0) * 35.0, 2.0));
  if (distance > 1.0) {
    float halo = exp(-(distance - 1.0) * 44.0) * .42 * upper;
    halo += exp(-(distance - 1.0) * 12.0) * .045 * upper;
    halo *= 1.0 - smoothstep(1.035, 1.145, distance);
    gl_FragColor = vec4(vec3(.025, .39, .84) * halo + vec3(.12, .43, .62) * dawn * .3,
                       max(halo, dawn * .3));
    return;
  }
  vec3 normal = vec3(p, sqrt(max(0.0, 1.0 - dot(p, p))));
  float y = normal.y * u_tilt.y + normal.z * u_tilt.x;
  float z = normal.z * u_tilt.y - normal.y * u_tilt.x;
  vec3 world = vec3(normal.x * u_rotation.y - z * u_rotation.x, y,
                    z * u_rotation.y + normal.x * u_rotation.x);
  vec2 uv = vec2(atan(world.x, world.z) / (2.0 * PI) + .5,
                 .5 - asin(clamp(world.y, -1.0, 1.0)) / PI);
  vec3 terrain = texture2D(u_surface, uv).rgb;
  vec3 night = texture2D(u_night, uv).rgb;
  float borders = texture2D(u_borders, uv).r;
  float luminance = dot(terrain, vec3(.2126, .7152, .0722));
  float light = max(dot(normal, normalize(vec3(-.4, .65, .8))), 0.0);
  vec3 surface = vec3(.007, .018, .036) + terrain * vec3(.13, .24, .4);
  surface += luminance * vec3(.012, .035, .065);
  surface *= .5 + .65 * light;
  float cities = pow(max(night.r - night.b * .85 - .01, 0.0), .75);
  cities += smoothstep(.3, .85, night.r) * .25;
  vec3 color = surface + vec3(1.0, .69, .33) * cities * 2.15;
  color += borders * vec3(.75, .48, .21) * (.18 + .28 * light);
  float fresnel = pow(1.0 - normal.z, 3.3);
  color += vec3(.025, .29, .55) * fresnel * upper;
  color += vec3(.14, .58, .88) * pow(1.0 - normal.z, 9.0) * .8 * upper;
  color += vec3(.2, .65, .9) * dawn * .6;
  float coverage = 1.0 - smoothstep(1.0 - u_feather, 1.0, distance);
  float haloAlpha = .465 * upper;
  vec3 haloColor = vec3(.025, .39, .84) * haloAlpha + vec3(.12, .43, .62) * dawn * .3;
  // Blend the limb into the outer atmosphere instead of leaving a dark seam.
  gl_FragColor = vec4(mix(haloColor, color, coverage), mix(haloAlpha, 1.0, coverage));
}`;

export function createEarthRenderer(canvas, images) {
  let gl;
  try {
    gl = canvas.getContext('webgl', {
      alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: true, powerPreference: 'low-power',
    });
  } catch { return null; }
  if (!gl) return null;
  const shaders = [];
  const textures = [];
  let program;
  let buffer;
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      // Older mobile GPUs can still render the static poster if highp is absent.
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Globe shader unavailable');
    }
    program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Globe program unavailable');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    images.forEach((image, index) => {
      const texture = gl.createTexture();
      textures.push(texture);
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(gl.getUniformLocation(program, ['u_surface', 'u_night', 'u_borders'][index]), index);
    });
    const rotation = gl.getUniformLocation(program, 'u_rotation');
    gl.uniform2f(gl.getUniformLocation(program, 'u_tilt'), Math.sin(14 * Math.PI / 180), Math.cos(14 * Math.PI / 180));
    const feather = gl.getUniformLocation(program, 'u_feather');
    return {
      draw(angle) {
        if (gl.isContextLost()) return;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(rotation, Math.sin(angle), Math.cos(angle));
        gl.uniform1f(feather, 2 / (canvas.width * .435));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    };
  } catch {
    textures.forEach(texture => gl.deleteTexture(texture));
    shaders.forEach(shader => gl.deleteShader(shader));
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    return null;
  }
}
