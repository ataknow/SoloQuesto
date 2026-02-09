import { Task } from "../hooks/useTasks";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface FocusModeProps {
  task: Task;
  onComplete: () => void;
  onExit: () => void;
  isDark: boolean;
}

export function FocusMode({ task, onComplete, onExit, isDark }: FocusModeProps) {
  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#1A1A1A]" : "bg-stone-50"
    }`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={task.id}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="flex-1 flex flex-col justify-start pt-12 px-8 relative w-full overflow-y-auto"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[#042861]/10 blur-3xl rounded-full -z-10 pointer-events-none" />

          <div className="pr-20 pb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-4xl font-bold leading-tight mb-6 break-words ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              {task.title}
            </motion.h1>

            {task.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-xl leading-relaxed whitespace-pre-wrap break-words ${
                  isDark ? "text-zinc-400" : "text-stone-600"
                }`}
              >
                {task.description}
              </motion.p>
            )}
          </div>

          {/* Side Buttons - Fixed on Right Edge */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onComplete}
              className="w-14 h-14 rounded-full bg-[#042861] text-white flex items-center justify-center shadow-xl hover:bg-[#042861]/80 transition-colors border-4"
              style={{ borderColor: isDark ? '#1A1A1A' : '#fafaf9' }}
              title="Mark as Done"
            >
              <Check className="w-7 h-7" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={onExit}
              className={`w-14 h-14 rounded-full flex items-center justify-center border-4 hover:opacity-80 transition-opacity ${
                isDark 
                  ? "bg-zinc-800 text-zinc-400 border-[#1A1A1A] hover:bg-zinc-700 hover:text-white" 
                  : "bg-white text-stone-500 border-stone-50 hover:bg-stone-100 hover:text-stone-900"
              }`}
              title="Exit Focus Mode"
            >
              <X className="w-7 h-7" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}