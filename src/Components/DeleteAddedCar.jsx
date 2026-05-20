import { TrashBin } from "@gravity-ui/icons";
import { AlertDialog, Button } from "@heroui/react";
import { FcDeleteDatabase } from "react-icons/fc";

const DeleteAddedCar = () => {
    return (
        <div>
            <AlertDialog>
                <Button className={"btn btn-sm btn-outline text-red-500 rounded-sm "}>
                    <TrashBin /> Delete
                </Button>

                <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog className="sm:max-w-100">
                            <AlertDialog.CloseTrigger />
                            <AlertDialog.Header>
                                <FcDeleteDatabase className="text-3xl" />
                                <AlertDialog.Heading>
                                    <p className="text-error font-bold">Delete This Car?</p>
                                </AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                                <p>
                                    This action will permanently delete the car data.
                                </p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button slot="close" variant="tertiary">
                                    Cancel
                                </Button>
                                <Button slot="close" variant="danger">
                                    Delete
                                </Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </div>
    );
};

export default DeleteAddedCar;