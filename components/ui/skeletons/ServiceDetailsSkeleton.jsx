const ServiceDetailsSkeleton = () => {
    return (
        <div className='flex flex-col lg:flex-row lg:items-center gap-9 pt-12'>
            <div className='flex flex-col gap-6'>
                <div className='rounded-lg h-[300px] bg-background-color'/>
                <div className='rounded-lg w-[250px] md:w-[400px] h-[25px] bg-background-color'/>
                <div className='rounded-lg w-[250px] md:w-[400px] h-[25px] bg-background-color'/>
                <div className='rounded-lg w-[250px] md:w-[130px] h-[25px] bg-background-color'/>
            </div>
            <div className='flex flex-col gap-6 mb-28'>
                <div className='bg-background-color w-[250px] md:w-[400px] h-[25px]'/>
                <div className='bg-background-color w-[250px] md:w-[400px] h-[25px]'/>
                <div className='bg-background-color w-[250px] md:w-[400px] h-[25px]'/>
                <div className='bg-background-color w-[250px] md:w-[400px] h-[25px]'/>
                <div className='bg-background-color w-[250px] md:w-[400px] h-[25px]'/>
            </div>
        </div>
    );
}

export default ServiceDetailsSkeleton;