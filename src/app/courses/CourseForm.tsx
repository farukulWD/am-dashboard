import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/common/Button"
import Input from "@/components/common/Input"
import Select from "@/components/common/Select"

const courseSchema = z.object({
  name: z.string().min(2, "Course name is required"),
  code: z.string().min(2, "Course code is required"),
  facultyId: z.string().min(1, "Faculty is required"),
  year: z.coerce.number().min(1, "Year is required"),
  capacity: z.coerce.number().min(1, "Capacity is required"),
})

export type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormProps {
  initialValues?: Partial<CourseFormValues>
  onSubmit: (values: CourseFormValues) => void
  onCancel: () => void
  faculty: { id: string; name: string }[]
  isLoading?: boolean
}

const CourseForm: React.FC<CourseFormProps> = ({ initialValues = {}, onSubmit, onCancel, faculty, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: initialValues.name || "",
      code: initialValues.code || "",
      facultyId: initialValues.facultyId || (faculty[0]?.id ?? ""),
      year: initialValues.year || 1,
      capacity: initialValues.capacity || 40,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Course Name</label>
        <Input {...register("name")}
          placeholder="Course name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Course Code</label>
        <Input {...register("code")}
          placeholder="Course code"
          className={errors.code ? "border-red-500" : ""}
        />
        {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Faculty</label>
        <Select {...register("facultyId")}
          options={faculty.map(f => ({ label: f.name, value: f.id }))}
          className={errors.facultyId ? "border-red-500" : ""}
        />
        {errors.facultyId && <p className="text-xs text-red-500 mt-1">{errors.facultyId.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Year</label>
        <Input type="number" min={1} {...register("year", { valueAsNumber: true })}
          placeholder="Year"
          className={errors.year ? "border-red-500" : ""}
        />
        {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Capacity</label>
        <Input type="number" min={1} {...register("capacity", { valueAsNumber: true })}
          placeholder="Capacity"
          className={errors.capacity ? "border-red-500" : ""}
        />
        {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity.message}</p>}
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" className="bg-gray-200 text-gray-700" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}

export default CourseForm 