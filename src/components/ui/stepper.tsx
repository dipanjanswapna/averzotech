
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface StepperContextValue extends StepperProps {
  clickable?: boolean
  isError?: boolean
  isLoading?: boolean
  isVertical?: boolean
  stepCount?: number
  expandVerticalSteps?: boolean
  activeStep: number
  initialStep: number
}

const StepperContext = React.createContext<
  StepperContextValue & {
    nextStep: () => void
    prevStep: () => void
    resetSteps: () => void
    setStep: (step: number) => void
  }
>({
  steps: [],
  activeStep: 0,
  initialStep: 0,
  nextStep: () => {},
  prevStep: () => {},
  resetSteps: () => {},
  setStep: () => {},
})

const useStepper = () => {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider")
  }
  return context
}

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & StepperProps
>((props, ref) => {
  const {
    className,
    children,
    orientation: orientationProp,
    state,
    responsive,
    checkIcon,
    errorIcon,
    styles,
    variables,
    // Extract Stepper-specific props so they don't get passed to the div
    initialStep,
    steps,
    expandVerticalSteps,
    onClickStep,
    ...rest
  } = props

  const [activeStep, setActiveStep] = React.useState(initialStep)
  const [isLastStep, setIsLastStep] = React.useState(false)

  React.useEffect(() => {
    setIsLastStep(activeStep === steps.length - 1)
  }, [activeStep, steps.length])

  const isVertical = orientationProp === "vertical"
  const isClickable = !!onClickStep

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const resetSteps = () => {
    setActiveStep(initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(Math.max(0, Math.min(step, steps.length - 1)))
  }
  
  const contextValue = {
      ...props,
      activeStep,
      isLastStep,
      isVertical,
      isClickable,
      nextStep,
      prevStep,
      resetSteps,
      setStep,
  };


  return (
    <StepperContext.Provider
      value={contextValue}
    >
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-wrap justify-between gap-x-2",
          isVertical ? "flex-col gap-y-4" : "flex-row",
          className,
          responsive && "flex-col md:flex-row"
        )}
        style={
          {
            "--step-color": "hsl(var(--accent))",
            "--active-step-color": "hsl(var(--primary))",
            "--step-border-color": "hsl(var(--border))",
            "--step-border-width": "2px",
            "--border-color": "hsl(var(--border))",
            "--connector-length": "2rem",
            "--connector-width": "2px",
            ...variables
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </StepperContext.Provider>
  )
})

type StepperProps = {
  initialStep: number
  steps: {
    label: string
    description?: string
    icon?: React.ElementType | React.ReactNode
  }[]
  orientation?: "vertical" | "horizontal"
  state?: "loading" | "error"
  responsive?: boolean
  checkIcon?: React.ReactNode
  errorIcon?: React.ReactNode
  onClickStep?: (step: number, setStep: (step: number) => void) => void
  styles?: {
    "main-container"?: string
    "step-container"?: string
    "step-button-container"?: string
    "step-label"?: string
    "step-description"?: string
    "step-icon"?: string
    "step-inner-container"?: string
    "step-content"?: string
    "step-content-container"?: string
    "connector-container"?: string
    "connector-line"?: string
  }
  variables?: {
    "--step-color"?: string
    "--active-step-color"?: string
    "--step-border-color"?: string
    "--step-border-width"?: string
    "--border-color"?: string
    "--connector-length"?: string
    "--connector-width"?: string
  }
  expandVerticalSteps?: boolean
}

type StepperItemProps = React.HTMLAttributes<HTMLDivElement> & {
  isCompletedStep?: boolean
  isKeepError?: boolean
  label?: string
  description?: string
  icon?: React.ElementType | React.ReactNode
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (props, ref) => {
    const {
      className,
      children,
      description,
      icon: PassedIcon,
      label,
      isCompletedStep,
      isKeepError,
      ...rest
    } = props
    const {
      steps,
      activeStep,
      isError,
      isLoading,
      isVertical,
      isClickable,
      setStep,
      checkIcon,
      errorIcon,
      styles,
      expandVerticalSteps,
    } = useStepper()

    const stepIndex = React.useMemo(
      () => steps.findIndex((step) => step.label === label),
      [steps, label]
    )
    const isLastStep = stepIndex === steps.length - 1
    const isCurrentStep = stepIndex === activeStep
    const isStepPassed = stepIndex < activeStep

    const isStepCompleted = isCompletedStep ?? isStepPassed
    const isStepLoading = isLoading && isCurrentStep

    const stepIsError = isError && isCurrentStep && !isStepLoading

    const Icon = PassedIcon ?? steps[stepIndex]?.icon
    
    const iconToRender = isStepLoading ? (
      <Loader2 className="animate-spin" />
    ) : stepIsError ? (
      errorIcon
    ) : isStepCompleted ? (
      checkIcon
    ) : (
      Icon
    )

    const renderChildren = () => {
        if (!isVertical) return children;
        if (isVertical && expandVerticalSteps) return children;
        if (isVertical && isCurrentStep) return children;
        return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "stepper-step-container",
          "flex items-start",
          "relative",
          isVertical ? "flex-col" : "flex-row",
          isVertical ? "" : "[&:not(:last-child)]:flex-1",
          className,
          styles?.["step-container"]
        )}
        {...rest}
      >
        <div className={cn(
            "stepper-step-inner-container",
            "flex items-center gap-4",
            isVertical ? "w-full" : "",
            styles?.["step-inner-container"]
        )}>

            <div
                data-completed={isStepCompleted}
                data-active={isCurrentStep}
                data-loading={isStepLoading}
                data-error={stepIsError}
                className={cn(
                "stepper-button-container",
                "flex items-center justify-center",
                "rounded-full border-2",
                "h-10 w-10 shrink-0",
                "transition-all duration-200",
                isStepCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border',
                isCurrentStep ? 'border-primary' : '',
                stepIsError ? 'bg-destructive border-destructive text-destructive-foreground' : '',
                isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && setStep(stepIndex)}
            >
                {iconToRender}
            </div>
            
            {!isVertical && label &&
              <div>
                <p className="font-semibold">{label}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            }
        </div>
        {!isLastStep &&
            <div
                className={cn(
                    "stepper-connector-container",
                    isVertical ? 'ms-5' : 'flex-1 mx-4',
                )}
            >
                <div
                    data-completed={isStepCompleted}
                    className={cn(
                        "stepper-connector-line",
                        "rounded-full",
                        isVertical ? 'h-[var(--connector-length)] w-[var(--connector-width)]' : 'bg-border',
                        isStepCompleted ? 'bg-primary' : 'bg-border',
                    )}
                />
            </div>
        }
        <div className={cn(
            "stepper-step-content-container",
            "w-full",
            isVertical ? "pl-14 pt-2 -mt-10 pb-4" : "mt-4",
            styles?.["step-content-container"]
        )}>
            {renderChildren()}
        </div>
      </div>
    )
  }
)

StepperItem.defaultProps = {
  checkIcon: <Check />,
  errorIcon: <Check />,
}

export { Stepper, StepperItem, useStepper }
