import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import clsx from "clsx"
import ImagePicker from "components/ImagePicker"
import { toastError } from "components/Toast"
import useAutocompleteTags from "hooks/useAutocompleteTags"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useMutation } from "react-query"
import ApiError from "services/api/Error"
import { IApiFaceFilters } from "services/api/models"
import CtaButton from ".."
import useFacesApi from "hooks/api/useFacesApi"

type PickImageButtonProps = {
  onPick?: (faceId: number) => void
  onDone?: (faceId: number | null) => void
  onClose?: () => void
  className?: string
  pickedFaceId?: number
}

const PickImageButton = (props: PickImageButtonProps) => {
  const { getAllFaces } = useFacesApi()
  const { onPick, onDone, onClose, className, pickedFaceId = null } = props

  const [open, setOpen] = useState(false)

  const { Autocomplete, selectedTags, isLoadingTags } = useAutocompleteTags({
    label: "Search tags",
    allowUserInput: false,
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    onClose?.()
    setOpen(false)
  }

  const reset = () => {
    setSelectedFaceId(null)
    handleClose()
  }

  const [selectedFaceId, setSelectedFaceId] = useState<number | null>(
    pickedFaceId
  )

  const handlePick = (faceId: number) => {
    onPick?.(faceId)
    setSelectedFaceId(faceId)
  }

  const handleDone = () => {
    onDone?.(selectedFaceId)
    handleClose()
  }

  const {
    mutate: mutateGetAllFaces,
    isLoading: isLoadingAllFaces,
    data: allFaces,
  } = useMutation(getAllFaces, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: error => {
      if (error instanceof ApiError) {
        toastError(error.toString())
      }
    },
  })

  useEffect(() => {
    if (open) {
      mutateGetAllFaces({
        tags: selectedTags,
      } as IApiFaceFilters)
    }
  }, [open, selectedTags])

  useEffect(() => {
    setSelectedFaceId(pickedFaceId)
  }, [pickedFaceId])

  const MemoizedImagePicker = useMemo(() => {
    if (!allFaces) return null

    return (
      <ImagePicker
        faces={allFaces}
        onPick={handlePick}
        selectedFaceId={selectedFaceId}
      />
    )
  }, [allFaces, selectedFaceId])

  return (
    <>
      <CtaButton
        onClick={handleClickOpen}
        label="Pick face"
        className={clsx("mt-2", className)}
      />
      <Dialog open={open}>
        <DialogTitle>Pick a face</DialogTitle>
        <DialogContent style={{ padding: "0.1rem" }}>
          <div className="flex mb-4 justify-center">
            <div className="w-11/12 ">
              {!isLoadingAllFaces && !isLoadingTags && Autocomplete}
            </div>
          </div>
          {!isLoadingAllFaces && !isLoadingTags && MemoizedImagePicker}
          {isLoadingAllFaces && (
            <div
              className="justify-center items-center flex"
              style={{ width: "10rem", height: "5rem" }}
            >
              <CircularProgress color="primary" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={reset}>Close</Button>
          <Button onClick={handleDone}>Done</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default PickImageButton
