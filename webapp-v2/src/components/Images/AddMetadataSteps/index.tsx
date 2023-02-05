import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useMemo, useState } from "react";
import useAddTagsStep from "./useAddTagsStep";

export interface MetadataStepProps {
  step: number;
}

export type AddMetadataStepsProps = {
  onDone: (metadata: Record<string, any>) => void;
  onCancel: () => void;
  open: boolean;
};

const TOTAL_STEPS = 1;

const AddMetadataSteps = (props: AddMetadataStepsProps) => {
  const { onDone, onCancel, open } = props;

  const [step, setStep] = useState(0);
  const [metadata, setMetadata] = useState<Record<string, any>>({
    tags: [],
  });

  const onStepChange = (newStep: number) => {
    if (newStep < 0 || newStep >= TOTAL_STEPS) {
      return;
    }

    setMetadata((prevMetadata) => {
      return {
        ...prevMetadata,
        ...data,
      }
    });
    
    setStep(newStep);
  };

  const { title: addTagsTitle, content: addTagsContent, data: addTagsData } = useAddTagsStep({ step });

  const { title, content, data } = useMemo(() => {
    switch (step) {
      case 0:
        return {
          title: addTagsTitle,
          content: addTagsContent,
          data: addTagsData,
        };
      default:
        return {
          title: addTagsTitle,
          content: addTagsContent,
          data: addTagsData,
        };
    }
  }, [step, addTagsTitle, addTagsContent, addTagsData]);

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
            <Button onClick={() => onDone({ ...metadata, ...data })}>
              Done
            </Button>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddMetadataSteps;