import { fetchRecruiterListApi } from '@/api/UserApi'
import { SIZE } from '@/constant/ListConstant'
import useUserData from '@/hooks/userLocalStorage'
import { SelectInterface } from '@/interface/SelectInterface'
import { Button, Popover, PopoverContent, PopoverTrigger, Spinner } from '@nextui-org/react'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const SelectRecruiter = ({ recruiter, setRecruiter }: { recruiter: SelectInterface | undefined, setRecruiter: any }) => {
    const { userData } = useUserData()
    const [hasMore, setHasMore] = useState(true);
    const [currentPageRecruiter, setCurrentPageRecruiter] = useState(0);

    const [recruiterList, setRecruiterList] = useState<SelectInterface[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const fetchMoreData = () => {
        if (recruiterList?.length < totalElements) {
            setTimeout(async () => {
                const dataNext = await fetchRecruiterListApi(`user/role/recruiter?page=${currentPageRecruiter + 1}&size=${SIZE}`)
                setRecruiterList(prev => [...prev, ...dataNext.content])
                setCurrentPageRecruiter(currentPageRecruiter + 1)
            }, 500); ``
        } else {
            setHasMore(false);
        }
    }
    const { isInterviewerRole } = useUserData()

    const [isLoaded, setIsLoaded] = useState(false); // Add a flag to track if the function has been called
    const loadInitRecruiterList = async () => {
        if (!isLoaded) { // Check if the function has already been called
            await fetchRecruiterListApi(`user/role/recruiter?page=0&size=${SIZE}`)
                .then(res => {
                    setRecruiterList(res.content)
                    setIsLoaded(true); // Set the flag to true after the function has been called
                    setTotalElements(res.totalElements);
                })
        }
    }
    const [isOpen, setIsOpen] = React.useState(false);

    const handleChooseRecruiter = (item: SelectInterface) => {
        setIsOpen(false);
        setRecruiter(item);
    }

    return (
        <div>
            <div className='flex flex-col  mt-4'>
                <div className='flex justify-start items-center '>
                    <label className='w-40 font-bold' htmlFor='phone'>Recruiter Owner{" "}
                        <span className='text-red-500 '>*</span>
                    </label>
                    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)} size='lg' placement='bottom'>
                        <PopoverTrigger >
                            <Button
                                isDisabled={isInterviewerRole()}
                                onClick={() => loadInitRecruiterList()} variant='bordered' size='lg'
                                className={`border-[1px] flex justify-start border-[#ccc] 
                                rounded-lg w-96 p-4  ${isInterviewerRole() ? "bg-gray-100" : "cursor-pointer"}`}>
                                {recruiter ? recruiter.label : "Select recruiter"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div id="scroll_infinite" className='max-h-96 w-96 overflow-y-auto '>
                                <InfiniteScroll
                                    dataLength={recruiterList?.length || 0}
                                    next={fetchMoreData}
                                    hasMore={hasMore}
                                    loader={<Spinner className={`mx-auto flex justify-center ${recruiterList?.length == totalElements ? "hidden" : ""}`} label='Loading more recruiters...' />}
                                    scrollableTarget="scroll_infinite"
                                >
                                    <div className='m-2 flex-col gap-2'>
                                        {recruiterList?.map((item: SelectInterface, index: number) => (
                                            <p onClick={() => handleChooseRecruiter(item)} className='font-medium flex hover:bg-slate-100 rounded-xl p-3 cursor-pointer'
                                                key={index}>
                                                {item.label}
                                            </p>
                                        ))}
                                        {recruiterList?.length == 0 && <p className=' font-medium flex hover:bg-slate-100
                                         rounded-xl p-3 cursor-pointer'>No more data</p>}
                                    </div>
                                </InfiniteScroll>
                            </div >
                        </PopoverContent>
                    </Popover>
                </div>
                <Button
                    isDisabled={isInterviewerRole()}
                    onPress={() => handleChooseRecruiter({ value: userData.id, label: `${userData.fullName} (${userData.username})` })} className='block mt-4 w-24 ml-40'>
                    Assign me
                </Button>
            </div>
        </div>
    )
}

export default SelectRecruiter