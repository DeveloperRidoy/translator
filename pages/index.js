import Head from "next/head";
import langs from "../utils/languages";
import {
  FaCaretDown,
  FaCopy,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import catchASync from "../utils/client/functions/catchASync";
import Axios from "../utils/client/Axios";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const timerRef = useRef();

  const [state, setState] = useState({
    text: "",
    translatedText: "fff",
    from: "",
    to: "",
    error: null,
    copyText: {show: false, copied: false}
  });

  // show error for 5 seconds
  useEffect(() => {
    if (!state.error) return;
    const timer = setTimeout(
      () => setState((state) => ({ ...state, error: null })),
      5000
    );
    return () => clearTimeout(timer);
  }, [state.error]);

  const timedTranslate = (e) => {
    if (!e.target.value)
      return setState((state) => ({ ...state, text: "", translatedText: "" }));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => translate(e.target.value), 1000);
  };

  const translate = (text) =>
    catchASync(async () => {
      if (!text)
        return setState((state) => ({
          ...state,
          text: "",
          translatedText: "",
        }));
      const res = await Axios.post("/translate", {
        text,
        from: state.from,
        to: state.to,
      });
      setState((state) => ({
        ...state,
        text,
        translatedText: res.data.data?.text,
      }));
    }, setState);

  // trigger translate on changing from and to option
  useEffect(() => {
    if (!state.text) return;
    translate(state.text);
  }, [state.from, state.to]);

  // copy text to clipboard 
  const copyToCilpBoard = () => {
    navigator.clipboard.writeText(state.translatedText);
    setState(state => ({...state, copyText: {...state.copyText, copied: true}}));
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-2 bg-gray-900 relative">
      <Head>
        <title>Translator</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="md:w-[800px] flex flex-col gap-20 items-center overflow-hidden">
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed top-1/2 -translate-y-1/2 p-2 bg-red-500 text-white z-10"
            >
              {state.error}
            </motion.div>
          )}
        </AnimatePresence>
        <img src="/logo.png" alt="translator" className="w-20" />
        <div className="w-full p-2 grid md:grid-cols-2 gap-16 relative">
          <div className="hidden md:block absolute text-white top-4 left-1/2 -translate-x-1/2">
            <FaLongArrowAltRight className="ml-1" />
            <FaLongArrowAltLeft className="-mt-2" />
          </div>
          <div>
            <select
              className="py-2 text-center w-full rounded-t-lg bg-gray-700 text-white"
              value={state.from}
              onChange={(e) =>
                setState((state) => ({ ...state, from: e.target.value }))
              }
            >
              {langs.map((lang) => (
                <option key={lang[0]} value={lang[0]}>
                  {lang[1]}
                </option>
              ))}
            </select>
            <textarea
              className="w-full p-2 bg-white min-h-[300px] text-black font-semibold "
              onKeyUp={timedTranslate}
            ></textarea>
          </div>
          <div>
            <select
              className="py-2 text-center w-full rounded-t-lg bg-gray-700 text-white"
              value={state.to}
              onChange={(e) =>
                setState((state) => ({ ...state, to: e.target.value }))
              }
            >
              {langs.map((lang) => (
                <option key={lang[0]} value={lang[0]}>
                  {lang[1]}
                </option>
              ))}
            </select>
            <div className="w-full p-2 bg-white h-[300px] font-semibold transition-all overflow-auto  relative">
              <p>{state.translatedText}</p>
              <AnimatePresence>
                {state.translatedText && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute bottom-4 left-4 text-blue-500 text-2xl"
                    onClick={copyToCilpBoard}
                    onMouseEnter={() =>
                      setState((state) => ({
                        ...state,
                        copyText: {
                          show: true,
                          copied: false,
                        },
                      }))
                    }
                    onMouseLeave={() =>
                      setState((state) => ({
                        ...state,
                        copyText: { ...state.copyText, show: false },
                      }))
                    }
                  >
                    <FaCopy />
                    <AnimatePresence>
                      {state.copyText.show && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: {duration: .2} }}
                          exit={{ scale: 0 }}
                          className={`text-white absolute -top-10 -left-3 text-sm  p-1 rounded text-center ${
                            state.copyText.copied
                              ? "bg-green-500"
                              : "bg-gray-700"
                          }`}
                        >
                          <span className="truncate">
                            {state.copyText.copied
                              ? "text copied"
                              : "copy text"}
                          </span>
                          <FaCaretDown
                            className={`absolute -bottom-3 left-4 text-xl ${
                              state.copyText.copied
                                ? "text-green-500"
                                : "text-gray-700"
                            }`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
