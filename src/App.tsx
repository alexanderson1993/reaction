import React, { Fragment, Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { StarsContainer } from "./components/StarsContainer";
import "./components/musicPlayer";
import { GameCanvas } from "./components/GameCanvas";
import Star from "./components/star";
import { Color, Vector3 } from "three";
import { Planet } from "./components/Planet";
import CourseComplete from "./components/CourseComplete";
import { GameButtons } from "./GameButtons";
import { Score } from "./Score";
import { Credits } from "./Credits";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { A11yAnnouncer, A11ySection } from "@react-three/a11y";
import { Tutorial } from "./Tutorial";
import { LevelSummary } from "./LevelSummary";
import { Dialog, Transition } from "@headlessui/react";
import { FaCircleNotch } from "react-icons/fa";
function CorrectLighting() {
  const { gl } = useThree();
  gl.physicallyCorrectLights = true;
  return null;
}

const queryClient = new QueryClient();

function User() {
  const user = useQuery("user", function getUser() {
    return fetch("/.netlify/functions/user").then((res) => res.json());
  });
  return null;
}

function OrderSuccess() {
  const params = new URLSearchParams(window.location.search);
  const [show, setShow] = useState(params.get("success") === "true");
  const [processing, setProcessing] = useState(true);
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId && processing) {
      fetch("/.netlify/functions/checkOrder")
        .then((res) => res.json())
        .then((res) => {
          setProcessing(false);
          console.log(res);
        });
    }
  }, [sessionId]);
  function close() {
    setShow(false);
  }
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        onClose={close}
        className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center "
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="bg-black bg-opacity-70 rounded-xl max-w-sm mx-auto border-2 border-white border-opacity-20 shadow-lg px-6 py-8 z-10">
            <Dialog.Title className="text-[#e97639] font-bold text-4xl text-center mb-4">
              Processing Order...
            </Dialog.Title>

            <Dialog.Description className="text-2xl flex justify-center">
              <FaCircleNotch className="animate-spin" />
            </Dialog.Description>

            <div className="modal-buttons opacity-0">
              <button className="gradient-box" onClick={close}>
                Got it.
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Credits />
      <Score />
      <Tutorial />
      <LevelSummary />
      <GameButtons />
      <OrderSuccess />
      <A11yAnnouncer />
      <Canvas
        dpr={window.devicePixelRatio}
        camera={{
          far: 10000,
          fov: 45,
          position: new Vector3(0, 0, 8),
        }}
      >
        <CorrectLighting />
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <CourseComplete />
          <A11ySection
            label="Game board"
            description="The game board is an 8 by 8 grid of objects, including atoms, mirrors, wormholes, and direction-changing arrows. Click on the atoms to charge them up and release their particles to create chain reactions. The level is complete when all of the atoms have been burst."
          >
            <GameCanvas />
          </A11ySection>
          <StarsContainer />
          <Planet scale={[10, 10, 10]} position={[-25, -3, -20]} />
          <Star
            scale={[20, 20, 20]}
            position={[20, 5, -15]}
            color1={new Color("orange")}
            color2={new Color("red")}
          />
        </Suspense>
      </Canvas>
    </QueryClientProvider>
  );
}

export default App;
