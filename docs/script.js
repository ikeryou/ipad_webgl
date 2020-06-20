
let _renderer, _mainScene, _mainCamera, _con, _light
let _mesh = []
let _cnt = 0
let _mouse = new THREE.Vector2(0, 0)


// -----------------
// 初期化
// -----------------
function init() {
	
  // make renderer
  _renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'low-power',
    canvas: document.getElementsByClassName('kv')[0]
  })
  _renderer.setClearColor(0x000000, 1) // 背景色
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  // make main scene
  _mainScene = new THREE.Scene()

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(90, 1, 0.1, 50000)

  _light = new THREE.PointLight(
    0xffffff,
    1
  )
  _mainScene.add(_light)

  _con = new THREE.Object3D()
  _mainScene.add(_con)

  for(let i = 0; i < 10; i++) {
	  
	let color = new THREE.Color(random(0, 1), random(0, 1), random(0, 1))
	let color2 = new THREE.Color(random(0, 1), random(0, 1), random(0, 1))
	  
	const seg = 32
    const mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5,seg),
	//   new THREE.MeshBasicMaterial({
	// 	color:color,
    //     side: THREE.DoubleSide,
	// 	transparent:true,
	// 	opacity:1,
    //     wireframe:true
	// })
      new THREE.MeshPhongMaterial({
        color:color,
        specular:color2,
        side: THREE.DoubleSide,
		// transparent:true,
		depthTest:false,
        wireframe:false
      })
    )
    _con.add(mesh)
	
    _mesh.push({
      mesh:mesh,
      noise:random(1, 2)
    })
	
  }
	
  // マウス位置
  window.addEventListener('mousemove', e => {
    const w = window.innerWidth
    const h = window.innerHeight
    const m = new THREE.Vector2(e.pageX, e.pageY)
    m.x = m.x / w
    m.y = m.y / h
    m.x -= 0.5
    m.y -= 0.5
    m.x *= 2
    m.y *= 2
    _mouse.copy(m)
  })

  window.addEventListener('resize', resize)
  resize()
  update()
}


// -----------------
// 更新
// -----------------
function update() {
	
  const w = window.innerWidth
  const h = window.innerHeight
  
  // 中央までの距離
  const max = 1 / Math.cos(radian(45))
  let d = Math.sqrt(_mouse.x * _mouse.x + _mouse.y * _mouse.y)
  d = map(d, 0, 1, 0, max * 0.6)
  
  const len = _mesh.length
  for(let i = 0; i < len; i++) {

    const mesh = _mesh[i].mesh
	const key = map(i, 0, 1, 0, len - 1)
	let op = Math.abs(key - d)
    // mesh.material.opacity = op
	
	// mesh.position.x = (_mouse.x - key) w * 0.1 * d
	
	const size = w * mix(0.001, 0.25, Math.pow(op, i + 1))
	mesh.scale.set(size, size, size)
  }
	
  const ease = 0.1 
  let tgX = _mouse.x * w * 0.5
  let tgY = _mouse.y * h * 0.5
  _con.position.x += (tgX - _con.position.x) * ease
  _con.position.y += (tgY * -1 - _con.position.y) * ease
  
  _light.position.x = _con.position.x * -1
  _light.position.y = _con.position.y * -1
  _light.position.z = 1000

  _con.rotation.x += 0.001
  _con.rotation.y = _con.position.y * 0.1 * (Math.PI / 180)
  _con.rotation.z = _con.position.x * -0.1 * (Math.PI / 180)

  _cnt++

  // rendering
  _renderer.render(_mainScene, _mainCamera)

  window.requestAnimationFrame(update)
}


// -----------------
// リサイズ
// -----------------
function resize() {
  const width = window.innerWidth
  const height = window.innerHeight

  _mainCamera.aspect = width / height
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = (height * 0.5) / Math.tan((_mainCamera.fov * 0.5) * Math.PI / 180)

  _renderer.setSize(width, height)
}


// -----------------
// ランダムな値取得
// -----------------
function random(min, max) {
  return Math.random() * (max - min) + min
}


function mix(x, y, a) {
  return x * (1 - a) + y * a
}


// ----------------------------------------
// 範囲変換
// @val     : 変換したい値
// @toMin   : 変換後の最小値
// @toMax   : 変換後の最大値
// @fromMin : 変換前の最小値
// @fromMax : 変換前の最大値
// ----------------------------------------
function map(val, toMin, toMax, fromMin, fromMax) {
  if(val <= fromMin) {
    return toMin;
  }
  if(val >= fromMax) {
    return toMax;
  }
  p = (toMax - toMin) / (fromMax - fromMin);
  return ((val - fromMin) * p) + toMin;
}


// ----------------------------------------
// 度からラジアンに変換
// @val : 度
// ----------------------------------------
function radian(val) {
  return val * Math.PI / 180;
}

// ----------------------------------------
// ラジアンから度に変換
// @val : ラジアン
// ----------------------------------------
function degree(val) {
  return val * 180 / Math.PI;
}

init()
