precision mediump float;
attribute vec2 a_position;
uniform mat4 u_transform;
uniform vec2 u_resolution;

void main() {
  // 从像素坐标转换到 0.0 到 1.0
  vec2 position = a_position / u_resolution;

  gl_Position = u_transform * vec4(position, 0, 1);
}