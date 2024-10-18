import React from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter, Button } from "@nextui-org/react";

export default function ModalComponent({ type, fetchSource, isOpen, onOpenChange, title }: any) {

    return (
        <>
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalFooter>
                                <Button className="bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 text-white font-medium  "
                                    onPress={fetchSource}>
                                    {type == 'logout' ? 'OK' : 'Yes'}
                                </Button>
                                <Button color="default" variant="bordered" onPress={onClose}>
                                    {type == 'logout' ? 'Cancel' : 'No'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
