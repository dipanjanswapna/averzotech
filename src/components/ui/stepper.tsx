
"use client"

import { cn } from "@/lib/utils"
import { Check, Loader } from "lucide-react"

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  activeStep: number
  initialStep?: number
}

export function Stepper({ steps, activeStep, initialStep = 0 }: StepperProps) {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center text-center">
            <div
              className={cn(
                "stepper-step-container flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                {
                  "data-[active=true]": index + initialStep < activeStep,
                  "data-[completed=true]": index + initialStep < activeStep,
                }
              )}
              data-active={index + initialStep < activeStep}
              data-completed={index + initialStep < activeStep}
            >
              <div className="stepper-button-container flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300">
                {index + initialStep < activeStep ? (
                  <Check className="h-5 w-5" />
                ) : index + initialStep === activeStep ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-lg font-semibold">{index + initialStep + 1}</span>
                )}
              </div>
            </div>
            <div className="mt-2">
                <p className="text-sm font-semibold">{step.label}</p>
                {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="stepper-separator h-1 w-full flex-1 bg-border transition-colors duration-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export type { Step };
