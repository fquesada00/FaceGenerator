import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useMemo, useState } from "react";
import useAddTagsStep from "./useAddTagsStep";

export interface MetadataStepProps {
  step: number;
}

export type AddMetadataStepsProps = {
  onDone: () => void;
  onCancel: () => void;
  open: boolean;
};

const TOTAL_STEPS = 1;

const AddMetadataSteps = (props: AddMetadataStepsProps) => {
  const { onDone, onCancel, open } = props;

  const [step, setStep] = useState(0);

  const onStepChange = (newStep: number) => {
    if (newStep < 0 || newStep >= TOTAL_STEPS) {
      return;
    }

    setStep(newStep);
  };

  const { title: addTagsTitle, content: addTagsContent } = useAddTagsStep({ step });

  const { title, content } = useMemo(() => {
    switch (step) {
      case 0:
        return {
          title: addTagsTitle,
          content: addTagsContent,
        };
      default:
        return {
          title: addTagsTitle,
          content: addTagsContent,
        };
    }
  }, [step]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions className="justify-around">
        {step > 0 && (
          <Button onClick={() => onStepChange(step - 1)}>
            Back
          </Button>
        )}
        <div>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          {step < TOTAL_STEPS - 1 && (
            <Button onClick={() => onStepChange(step + 1)}>
              Next
            </Button>
          )}
          {step === TOTAL_STEPS - 1 && (
            <Button onClick={onDone}>
              Done
            </Button>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddMetadataSteps;