import React from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter, Button, ModalBody } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { JobFormExcelInterface } from "@/interface/JobInterface";
import { Truncate } from "@/util/truncate";
import { FormatDate } from "@/util/FormatDate";

export default function ModalExcel({ data, fetchSource, isOpen, onOpenChange, title }: any) {
    console.log("data", data)
    return (
        <>
            <Modal size="5xl" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody>
                                <table className="w-full ">
                                    <thead>
                                        <tr className="bg-gradient-to-r rounded-xl  from-sky-400 to-blue-500  text-left text-xs
                                          font-semibold uppercase tracking-widest text-white">
                                            <td className="pr-3 pl-2 py-2 rounded-tl-lg">Job Title</td>
                                            <td className="pr-3 py-2">Start date</td>
                                            <td className="pr-3 py-2">End date</td>
                                            <td className="pr-3 py-2">Salary range</td>
                                            <td className="pr-3 py-2">Working address</td>
                                            <td className="pr-3 py-2  rounded-tr-lg">Description</td>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-500 ">
                                        {data?.map((item: JobFormExcelInterface, index: number) => {
                                            return (
                                                <tr key={index} className={`hover:bg-slate-100 transition rounded-xl  border-2 cursor-pointer  `}>
                                                    <td
                                                        className="border-b border-gray-200 text-sm ">
                                                        <p className="font-medium flex items-center gap-2 px-2 py-4 text-sm ">
                                                            {item?.title || "N/A"}
                                                        </p>
                                                    </td>
                                                    <td
                                                        className="border-b border-gray-200  gap-3 justify-start   text-sm ">
                                                        <p className="font-medium  py-4 text-sm ">
                                                            {item?.startDate || "N/A"}
                                                        </p>
                                                    </td>
                                                    <td
                                                        className=" border-b border-gray-200   gap-3 justify-start  text-sm ">
                                                        <p className="font-medium    py-4 text-sm ">
                                                            {item?.endDate || "N/A"}
                                                        </p>
                                                    </td>
                                                    <td
                                                        className=" border-b font-medium border-gray-200  text-sm ">
                                                        <p>
                                                            {`${item.salaryFrom}- ${item.salaryTo}` || "N/A"}
                                                        </p>
                                                    </td>
                                                    <td
                                                        className=" border-b font-medium border-gray-200  text-sm ">
                                                        <p>
                                                            {item?.workingAddress || "N/A"}
                                                        </p>
                                                    </td>
                                                    <td
                                                        className=" border-b font-medium border-gray-200  text-sm ">
                                                        <p>
                                                            {item?.description || "N/A"}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-gradient-to-r from-sky-400 to-blue-500 bg-indigo-500 text-white font-medium  "
                                    onPress={fetchSource}>
                                    Confirm
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
