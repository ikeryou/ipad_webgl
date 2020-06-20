
let _renderer, _mainScene, _mainCamera, _con, _light
let _mesh = []
let _cnt = 0
let _tgPos = new THREE.Vector2()
let _tgScale = 1
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
  _renderer.setClearColor(0xffffff, 1) // 背景色
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

  const seg = 1
  for(let i = 0; i < 15; i++) {
    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1,1,1,seg,seg,seg),
      new THREE.MeshPhongMaterial({
        color:0x000000,
        specular:0x000000,
        side: THREE.DoubleSide,
        wireframe:(Math.random() > 0.5)
      })
    )
    _con.add(mesh)
    _mesh.push({
      mesh:mesh,
      noise:random(0.8, 2.1),
      size:new THREE.Vector3(1,1,1),
      rot:new THREE.Vector3(1,1,1),
      scale:1,
      superNoise:Math.random() < 0.1
    })
  }

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

  // 一定間隔でアクション
  let changeFlg = false
  if(_cnt % 60 == 0) {
    _tgScale = 1.25
    _con.scale.set(_tgScale, _tgScale, _tgScale)
    changeFlg = true
    _light.position.x = random(-w, w)
    _light.position.y = random(-w, w)
    _light.position.z = random(-w, w)
    resize()
  }



  const ease = 0.1

  const len = _mesh.length
  for(let i = 0; i < len; i++) {

    const mesh = _mesh[i].mesh
    const size = _mesh[i].size
    const rot = _mesh[i].rot
    let noise = _mesh[i].noise



    // 目標に向かってだんだん近くことで移動感のあるゆらゆらに
    let x = _tgPos.x * noise + w * _mouse.x * -0.5
    let y = _tgPos.y * noise + w * _mouse.y * 0.5

    // if(_mesh[i].superNoise) {
    //   x *= 2
    //   y *= 2
    // }

    mesh.position.x += (x - mesh.position.x) * ease
    mesh.position.y += (y - mesh.position.y) * ease
    // mesh.position.z += (y - mesh.position.z) * ease

    // 一定間隔で目標位置を変更
    if(_cnt % 3 == 0) {
      const range = w * 0.01;
      _tgPos.x = random(-range, range)
      _tgPos.y = random(-range, range)
    }

    // 一定間隔でアクション
    if(changeFlg) {
      mesh.material.wireframe = Math.random() < 0.5

      hBase = random(0, 360)
      c = new THREE.Color('hsl(' + ~~(hBase) + ', 100%, 50%)')
      c2 = new THREE.Color(1 - c.r, 1 - c.g, 1 - c.b)
      mesh.material.color = c
      mesh.material.specular = c2
      // mesh.material.color = new THREE.Color(Math.random(), Math.random(), Math.random())
      // mesh.material.specular = new THREE.Color(Math.random(), Math.random(), Math.random())
      // mesh.material.emissive = new THREE.Color(Math.random(), Math.random(), Math.random())

      _mesh[i].scale = random(5, 10)
    }

    mesh.rotation.x = rot.x
    mesh.rotation.y = rot.y
    mesh.rotation.z = rot.z

    // const ease2 = Math.pow(0.5, i)
    // _mesh[i].scale += (1 - _mesh[i].scale) * ease
    //   const s = 3
    //
    // mesh.scale.x += (size.x * s - mesh.scale.x) * ease
    // mesh.scale.y += (size.y * s - mesh.scale.y) * ease
    // mesh.scale.z += (size.z * s - mesh.scale.z) * ease

    // この辺は雰囲気づくり
    // 適当に値を流用
    // mesh.rotation.x += ((_tgScale - 1) - mesh.rotation.x) * ease
    // mesh.rotation.y += ((_tgScale - 1) - mesh.rotation.y) * ease
    // mesh.rotation.z += ((_tgScale - 1) - mesh.rotation.z) * ease
  }

  // 常に1にだんだん近く
  _tgScale += (1 - _tgScale) * ease

  // 目標スケールにだんだん近く
  const tgSize = _tgScale
  _con.scale.x += (tgSize - _con.scale.x) * ease
  _con.scale.y += (tgSize - _con.scale.y) * ease
  _con.scale.z += (tgSize - _con.scale.z) * ease

  let tgX = _mouse.x * w * 0.25
  let tgY = _mouse.y * h * 0.25
  // tgX *= mix(, 1, _mouse.distanceTo(new THREE.Vector3(0,0,0)))
  _con.position.x += (tgX - _con.position.x) * ease
  _con.position.y += (tgY * -1 - _con.position.y) * ease

  _con.rotation.x += 0.001
  // _con.rotation.y += 0.001
  _con.rotation.y = _con.position.y * 0.1 * (Math.PI / 180)
  _con.rotation.z = _con.position.x * 0.1 * (Math.PI / 180)

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


  for(let i = 0; i < _mesh.length; i++) {
    let size = width * 0.05 * _mesh[i].noise
    if(Math.random() < 0.2) {
      size *= 10
    }
    if(Math.random() < 0.5) {
      size *= 0.2
    }
    _mesh[i].mesh.scale.set(size, Math.max(width, height) * 3.5, size)
    // _mesh[i].size.set(size, Math.max(width, height) * 1.5, size)
    // _mesh[i].mesh.rotation.z = random(-90, 90) * (Math.PI / 180)
    // _mesh[i].mesh.rotation.x = random(-90, 90) * (Math.PI / 180)
    // _mesh[i].mesh.rotation.y = random(-90, 90) * (Math.PI / 180)

    _mesh[i].rot.set(
      random(-90, 90) * (Math.PI / 180),
      random(-90, 90) * (Math.PI / 180),
      random(-90, 90) * (Math.PI / 180)
    )

  }
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


init()
