// Background theme tab: "classic" (flat sage) or "shader" (animated ShaderGradient).
// The shader library is only downloaded when the shader theme is first chosen.
var root = document.documentElement;
var tabs = Array.prototype.slice.call(document.querySelectorAll('.theme-tab button'));
var host = document.getElementById('shader-bg');
var loading = null;
var mounted = false;

function store(value) {
  try { localStorage.setItem('bg-theme', value); } catch (e) {}
}
function saved() {
  try { return localStorage.getItem('bg-theme'); } catch (e) { return null; }
}

function mountShader() {
  if (loading) return loading;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  loading = Promise.all([
    import('https://esm.sh/react@18.3.1'),
    import('https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1'),
    import('https://esm.sh/@shadergradient/react@2.4.20?deps=react@18.3.1,react-dom@18.3.1,three@0.170.0,@react-three/fiber@8.17.10')
  ]).then(function (m) {
    var React = m[0].default || m[0];
    var createRoot = m[1].createRoot;
    var SG = m[2];
    var gradient = React.createElement(SG.ShaderGradient, {
      animate: reduce ? 'off' : 'on', axesHelper: 'off', bgColor1: '#000000', bgColor2: '#000000',
      brightness: 1, cAzimuthAngle: 180, cDistance: 2.81, cPolarAngle: 80, cameraZoom: 9.1,
      color1: '#606080', color2: '#8d7dca', color3: '#212121', destination: 'onCanvas',
      embedMode: 'off', envPreset: 'city', format: 'gif', fov: 45, frameRate: 10,
      gizmoHelper: 'hide', grain: 'on', lightType: '3d', pixelDensity: 1,
      positionX: 0, positionY: 0, positionZ: 0, range: 'disabled', rangeEnd: 40, rangeStart: 0,
      reflection: 0.1, rotationX: 50, rotationY: 0, rotationZ: -60, shader: 'defaults',
      type: 'waterPlane', uAmplitude: 0, uDensity: 1.5, uFrequency: 0, uSpeed: 0.3,
      uStrength: 1.5, uTime: 8, wireframe: false
    });
    createRoot(host).render(React.createElement(SG.ShaderGradientCanvas, {
      style: { position: 'absolute', inset: 0 }, pointerEvents: 'none', pixelDensity: 1, fov: 45
    }, gradient));
    mounted = true;
  });
  return loading;
}

function apply(value) {
  tabs.forEach(function (b) {
    var on = b.dataset.bg === value;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
  if (value === 'shader') {
    root.setAttribute('data-bg', 'shader');
    mountShader().catch(function () {
      loading = null;
      if (root.getAttribute('data-bg') === 'shader') apply('classic');
    });
  } else {
    root.removeAttribute('data-bg');
  }
}

tabs.forEach(function (b) {
  b.addEventListener('click', function () { store(b.dataset.bg); apply(b.dataset.bg); });
});

apply(saved() === 'classic' ? 'classic' : 'shader');
