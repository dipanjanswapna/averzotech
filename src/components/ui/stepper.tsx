
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
    ...rest
  } = props

  const [activeStep, setActiveStep] = React.useState(props.initialStep)
  const [isLastStep, setIsLastStep] = React.useState(false)

  React.useEffect(() => {
    setIsLastStep(activeStep === props.steps.length - 1)
  }, [activeStep, props.steps.length])

  const isVertical = orientationProp === "vertical"
  const isClickable = !!props.onClickStep

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, props.steps.length - 1))
  }

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const resetSteps = () => {
    setActiveStep(props.initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(Math.max(0, Math.min(step, props.steps.length - 1)))
  }

  return (
    <StepperContext.Provider
      value={{
        ...props,
        activeStep,
        isLastStep,
        isVertical,
        isClickable,
        nextStep,
        prevStep,
        resetSteps,
        setStep,
      }}
    >
      <div
        ref={ref}
        className={cn(
          "stepper-horizontal-container",
          "flex w-full flex-wrap justify-between gap-x-2",
          isVertical && "stepper-vertical-container flex-col",
          className,
          responsive && "flex-col md:flex-row"
        )}
        style={
          {
            "--step-color": variables?.["--step-color"],
            "--active-step-color": variables?.["--active-step-color"],
            "--step-border-color": variables?.["--step-border-color"],
            "--step-border-width": variables?.["--step-border-width"],
            "--border-color": variables?.["--border-color"],
            "--connector-length": variables?.["--connector-length"],
            "--connector-width": variables?.["--connector-width"],
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
    icon?: React.ElementType
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
  icon?: React.ElementType
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (props, ref) => {
    const {
      className,
      children,
      description,
      icon: PasedIcon,
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

    const isStepDisabled =
      !isStepPassed && !isCurrentStep && !isStepLoading && !isError
      
    const Icon = PasedIcon ?? steps[stepIndex]?.icon
    
    const iconToRender = isStepLoading ? (
      <Loader2 className="animate-spin" />
    ) : stepIsError ? (
      errorIcon
    ) : isStepCompleted ? (
      checkIcon
    ) : Icon ? (
      <Icon />
    ) : (
      stepIndex + 1
    )

    const renderChildren = () => {
      if (isVertical && !expandVerticalSteps && !isCurrentStep) {
        return null
      }
      return children
    }

    return (
      <div
        ref={ref}
        className={cn(
          "stepper-step-container",
          "flex items-center",
          "relative",
          isVertical ? "flex-col" : "flex-row",
          "[&:not(:last-child)]:flex-1",
          className,
          styles?.["step-container"]
        )}
        {...rest}
      >
        <div
          className={cn(
            "stepper-step-inner-container",
            "flex items-center gap-4",
            isVertical ? "w-full" : "",
            styles?.["step-inner-container"]
          )}
        >
          <div
            data-optional={stepIndex > activeStep}
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
              isStepDisabled
                ? "border-muted-foreground/20 bg-muted text-muted-foreground"
                : "",
              isCurrentStep ? "border-primary bg-primary text-primary-foreground" : "",
              isStepCompleted
                ? "border-primary bg-primary text-primary-foreground"
                : "",
              stepIsError ? "border-destructive bg-destructive text-destructive-foreground" : "",
              styles?.["step-button-container"],
              isClickable && "cursor-pointer"
            )}
            onClick={() => isClickable && setStep(stepIndex)}
          >
            {iconToRender}
          </div>
          <div
            className={cn(
              "stepper-step-label-container",
              "flex flex-col justify-center",
              isVertical ? "w-full" : "",
              styles?.["step-label-container"]
            )}
          >
            <p
              className={cn(
                "stepper-step-label",
                "text-sm font-medium",
                isStepPassed ? "text-muted-foreground" : "",
                isCurrentStep ? "text-primary" : "",
                stepIsError ? "text-destructive" : "",
                styles?.["step-label"]
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "stepper-step-description",
                "text-xs text-muted-foreground",
                styles?.["step-description"]
              )}
            >
              {description}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "stepper-connector-container",
            "w-full",
            isVertical ? "mt-4" : "ms-4",
            isLastStep ? "hidden" : "",
            styles?.["connector-container"]
          )}
        >
          <div
            data-completed={isStepCompleted}
            className={cn(
              "stepper-connector-line",
              "h-1 w-full rounded-full",
              isStepPassed ? "bg-primary" : "bg-muted",
              styles?.["connector-line"]
            )}
          />
        </div>
        <div
          className={cn(
            "stepper-step-content-container",
            "w-full",
            isVertical ? "ms-4 border-s-2" : "mt-4",
            isVertical && isLastStep ? "border-none" : "",
            isVertical && isStepCompleted ? "border-primary" : "",
            isVertical && stepIsError ? "border-destructive" : "",
            isVertical && expandVerticalSteps ? "min-h-40" : "",
            styles?.["step-content-container"]
          )}
        >
          <div className={cn("stepper-step-content", styles?.["step-content"])}>
            {renderChildren()}
          </div>
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
