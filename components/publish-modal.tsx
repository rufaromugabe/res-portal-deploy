import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface PublishListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishListModal({ isOpen, onClose }: PublishListModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish List of Accepted Students</DialogTitle>
          <DialogDescription>
            This action will publish the list of all accepted students to this
            url https://res-portal.hit.ac.zw/accepted-students
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant={"outline"}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Add logic here to generate and download the Excel file
              console.log("Downloading Excel template...");
              onClose();
            }}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}