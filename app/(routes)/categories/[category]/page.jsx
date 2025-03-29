'use client';
import { getCategoryServices } from '../../../../utils/globalApi';
import { ServicesList } from '@components/common';
import useFetch from '../../../../hooks/useFetch';
import { useParams } from 'next/navigation'; // Import useParams

const CategoryPage = () => {

    const params = useParams(); // Use useParams() to get the params
    const category = params?.category?.toLowerCase();

    const { data, loading, error } = useFetch(
        () => getCategoryServices(category),
        category
    );

    return (
        <ServicesList
            cols={3}
            title={`${params?.category} Services`}
            services={data?.services}
            loading={loading}
            error={error}
        />
    );
};

export default CategoryPage;