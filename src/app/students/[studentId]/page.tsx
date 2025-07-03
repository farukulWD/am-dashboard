import SingleStudentPage from '@/components/students/SingleStudentPage';
import React from 'react'

export default async function SingleStudent({ params }: { params: { studentId: string } }) {
    const { studentId } = await params;
    return (
        <div>
            <SingleStudentPage params={{ studentId }} />
        </div>
    )
}