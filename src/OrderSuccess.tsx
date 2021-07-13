import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaCircleNotch } from "react-icons/fa";
import { useLevelStore } from "./stores/levelStore";

export function OrderSuccess({ email = "" }) {
  const params = new URLSearchParams(window.location.search);
  const [show, setShow] = useState(params.get("success") === "true" || !!email);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const sessionId = params.get("session_id");

  useEffect(() => {
    if ((sessionId || email) && processing) {
      fetch("/.netlify/functions/checkOrder", {
        method: "POST",
        body: JSON.stringify({ sessionId, email }),
      })
        .then((res) => res.json())
        .then((res) => {
          setProcessing(false);
          if (res.error) setError(res.error);
          else {
            setName(res.customerName);
            useLevelStore.setState({ gameData: res.gameData });
            localStorage.setItem("game_data", JSON.stringify(res.gameData));
          }
        });
    }
  }, [sessionId, email]);
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
              {error ? "Error!" : name ? "Done!" : "Processing Order..."}
            </Dialog.Title>

            <Dialog.Description className="text-2xl flex justify-center">
              {error ? (
                error
              ) : name ? (
                <div>Thank you {name} for your purchase!</div>
              ) : (
                <FaCircleNotch className="animate-spin" />
              )}
            </Dialog.Description>

            <div className={`modal-buttons ${name ? "" : "opacity-0"}`}>
              <button className="gradient-box" onClick={close}>
                Close
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
