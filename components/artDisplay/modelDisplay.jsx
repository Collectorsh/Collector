import { Suspense } from "react"
import { Canvas, useLoader } from "@react-three/fiber"
import { Html, OrbitControls, useGLTF } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader';
import * as THREE from "three"

const ModelViewer = ({
  vrUrl,
  onLoad,
  style,
  wrapperClass = "w-full h-full absolute inset-0",
}) => {
   
  return (
    <div className={wrapperClass}>
      <model-viewer
        // style={{width:"100%", height: "100%"}}
        // className="w-full h-full"
        // alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum"
        src={"https://arweave.net/xqDT37dkwDAQolSWOs8F6DOKA3-SaZWgVSI-i-2Ujqs?ext=glb"}
        ar
        camera-controls
        touch-action="pan-y"
        // auto-rotate
        // disable-zoom
        // ar-status="not-presenting"
        loading="eager"
        shadow-intensity="1"
        // ar-placement="wall"
      ></model-viewer>

      {/* <Canvas invalidateFrameloop >
        <ambientLight />
        <spotLight intensity={2} position={[20, 20, 20]} />
        <Suspense fallback={<Html center>loading..</Html>}>
          <Model vrUrl={vrUrl} />
        </Suspense>
        <OrbitControls />
      </Canvas>, */}
    </div>
  );

};


export default ModelViewer;

const Model = ({vrUrl, props}) => {
  // location of the 3D model
  // const gltf = useLoader(GT, vrUrl);
  // console.log("🚀 ~ file: modelDisplay.jsx:36 ~ Model ~ gltf:", gltf)
  // return (
  //   <>
  //     <primitive object={gltf.scene} dispose={null} {...props} />
  //   </>
  // );
  const { nodes, materials } = useGLTF("https://arweave.net/xqDT37dkwDAQolSWOs8F6DOKA3-SaZWgVSI-i-2Ujqs?ext=glb");

  return (
    <>
      {Object.keys(nodes).map((name) => {
        const node = nodes[name];
        if (node.isMesh) {
          return (
             <primitive key={name} object={node} />
            // <mesh
            //   key={name}
            //   geometry={node.geometry}
            //   material={materials[node.material.name]}
            // />
          );
        }
        return null;
      })}
    </>
  );
};