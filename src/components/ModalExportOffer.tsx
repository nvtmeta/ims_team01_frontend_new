import React from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter, Button, ModalBody } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { JobFormExcelInterface } from "@/interface/JobInterface";
import { Truncate } from "@/util/truncate";
import { FormatDate } from "@/util/FormatDate";
import { useForm } from "react-hook-form";
import messages from "@/messages/messages";

export default function ModalExportExcel({ isOpen, onOpenChange, handleSubmitExport }: any) {
    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues
    } = useForm()

    return (
        <>
            <Modal size="2xl" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col justify-center text-xl gap-1">Export Offer</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit((data: any) => handleSubmitExport(data as any))} className='ml-2 flex justify-around items-center gap-2'>
                                    <div>
                                        <label htmlFor='contractFromDate'>From</label>
                                        <input
                                            type='date' className="ml-3  border-2 border-slate-100  p-2 rounded-xl"
                                            {...register("contractFromDate", {
                                                required: messages.ME002, validate: (value: any) => {
                                                    if (value >= getValues("contractToDate")) {
                                                        return messages.ME017; // End date must be later than Start date
                                                    } else {
                                                        return true; // Return true if validation passes
                                                    }
                                                },
                                            })}
                                        />
                                        {errors.contractFromDate && <p role="startTime" className='text-red-500 ml-0  max-w-44 mt-3'>{errors.contractFromDate.message?.toString()}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor='contractToDate'>To</label>
                                        <input
                                            type='date' className="border-2 ml-3  border-slate-100  p-2 rounded-xl"
                                            {...register("contractToDate", {
                                                required: messages.ME002, validate: (value: any) => {
                                                    if (value <= getValues("contractFromDate")) {
                                                        return messages.ME018; // End date must be later than Start date
                                                    } else {
                                                        return true; // Return true if validation passes
                                                    }
                                                },
                                            })}
                                        />
                                        {errors.contractToDate && <p role="startTime" className='text-red-500 ml-0 max-w-44  mt-3'>{errors.contractToDate.message?.toString()}</p>}
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 text-white font-medium  "
                                    onClick={handleSubmit((data: any) => handleSubmitExport(data as any))}>
                                    Submit
                                </Button>
                                <Button color="default" variant="bordered" onPress={onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
