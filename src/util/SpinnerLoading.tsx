import { Image, Spinner } from '@nextui-org/react'
import React from 'react'

const SpinnerLoading = ({ data, isLoading, error }: any) => {
    return (
        <div className='mt-6'>
            <div className='flex justify-center items-center w-full'>
                {isLoading ? <Spinner label="Loading" color="primary" labelColor="primary" /> :
                    (error && <Image className='w-96' src='https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?t=st=1714090657~exp=1714094257~hmac=623016adab29d11866202e93cf1bafdbaa55f1e3d6492c2892ab480958a729e2&w=740' />
                    )
                }
                {
                    !data && !isLoading && !error &&
                    <p className='text-xl font-medium '>
                        No item Available
                    </p>
                }
            </div>
        </div>
    )
}

export default SpinnerLoading