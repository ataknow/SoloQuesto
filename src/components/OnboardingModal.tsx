import { useState } from "react";
import { Button } from "../components/ui/button";
import { Camera, Pin, Target, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function OnboardingModal({ isOpen, onClose, isDark }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Camera,
      title: "Scan Your List",
      description: "Take a photo of your handwritten list and we'll convert it into digital tasks instantly.",
    },
    {
      icon: Pin,
      title: "Pin Your Priority",
      description: "Pin important tasks to the top so they're always visible and never forgotten.",
    },
    {
      icon: Target,
      title: "Focus Mode",
      description: "Enter Focus Mode to see only your current task with a built-in Pomodoro timer.",
    },
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`w-full max-w-md rounded-2xl p-6 ${isDark ? "bg-zinc-900" : "bg-white"}`}>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <currentStep.icon className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-3">{currentStep.title}</h2>
        <p className={`text-center mb-8 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          {currentStep.description}
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-red-600" : "w-2 bg-zinc-300 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                onClose();
              }
            }}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {step < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}