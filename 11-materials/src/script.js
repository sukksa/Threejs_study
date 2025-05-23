import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
// Debug
const gui = new dat.GUI()

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const hdrLoader = new RGBELoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg', () => {
    console.log('loaded');
})
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTextrue = textureLoader.load('/textures/gradients/5.jpg') // 渐变纹理
gradientTextrue.minFilter = THREE.NearestFilter
gradientTextrue.magFilter = THREE.NearestFilter
gradientTextrue.generateMipmaps = false

const environmentMapTextrue = cubeTextureLoader.load([
    '/textures/bak1/left.jpg', // 正x
    '/textures/bak1/right.jpg', // 正x
    '/textures/bak1/top.jpg', // 正x
    '/textures/bak1/down.jpg', // 正x
    '/textures/bak1/front.jpg', // 正x
    '/textures/bak1/back.jpg', // 正x
])


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// // material.map = doorColorTexture
// // material.color.set('red')
// // material.color = new THREE.Color('red')
// // material.wireframe = true

// material.transparent = true 
// material.opacity = 0.5
// material.alphaMap = doorColorTexture

// 设置内外哪面可见
// material.side = THREE.FrontSide // 默认
// material.side = THREE.BackSide
// material.side = THREE.DoubleSide // 两面可见

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial // 在无光源的情况下，使用matcap可以模拟光照效果
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial 近点白色，远点是黑色。用于制作雾效和预处理
// const material = new THREE.MeshDepthMaterial()

// MeshLambertMaterial 漫反射
// const material = new THREE.MeshLambertMaterial()

// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100 
// material.specular = new THREE.Color(0xff0000) // 高光颜色

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTextrue
// // magFilter 在修正这个非常小的纹理，并把它拉伸，通过MIP映射模糊化处理，设置THREE.NearestFilter

// MeshStandardMaterial 类似THREE.MeshPhongMaterial，MeshLambMaterial，支持光照
// 算法更逼真，遵循物理渲染（PBR)
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.2
// material.roughness = 0.2
// material.map = doorColorTexture

// // aoMap  环境遮挡贴图，增加缝隙的阴影，增加细节
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1 // 环境遮挡贴图强度


// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// // material.displacementBias = 0.5
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture

// material.normalMap = doorNormalTexture
// material.normalScale.set(1, 1)

// material.transparent = true
// material.alphaMap = doorAlphaTexture
// // material.wireframe = true
// console.log(material);

// 加载 HDR 贴图
const hdrTextrue = hdrLoader.load(
    'textures/environmentMap/2k.hdr',
    (texture) => {
        // 设置映射模式（必须！）
        texture.mapping = THREE.EquirectangularReflectionMapping;

        // 设置为场景环境贴图（影响所有PBR材质）
        // scene.environment = texture;

        // 可选：设置为背景
        scene.background = texture;
    },
    (progress) => {
        console.log(`加载进度: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
    },
    (error) => {
        console.error('HDR 加载失败:', error);
    }
);


const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
// material.envMap = environmentMapTextrue
material.envMap = hdrTextrue

// scene.background = environmentMapTextrue

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -1.5
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))


scene.add(new THREE.AxesHelper(1))
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)


plane.geometry.setAttribute('uv2', plane.geometry.getAttribute('uv').clone())
console.log(plane.geometry.attributes);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5
scene.add(sphere, plane, torus)
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01)
// gui.add(material, 'displacementScale').min(-1).max(1).step(0.01)
// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0.001)

pointLight.position.set(0, 2, 2) // 更靠近物体
scene.add(pointLight)
// 添加光源辅助线（直径0.5的线框球体）
scene.add(new THREE.PointLightHelper(pointLight, 1))
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    sphere.rotation.y = 0.1 * elapsedTime
    sphere.rotation.x = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    plane.rotation.x = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    torus.rotation.x = 0.1 * elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()