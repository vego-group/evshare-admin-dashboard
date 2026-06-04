"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/modal";
import type { AddUserFormValues } from "@/schemas/users";
import { addUser } from "@/services/mutations";

import { UserFormActions } from "./user-form-modal-parts";
import UserFormFields from "./user-form-fields";
import { addUserDefaultValues, addUserFormResolver, buildAddUserPayload } from "./user-form-utils";

type UserAddModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

function UserAddModal({ open, onClose, onSaved }: UserAddModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    resolver: addUserFormResolver,
    defaultValues: addUserDefaultValues,
    mode: "onChange",
  });

  const handleClose = () => {
    reset(addUserDefaultValues);
    onClose();
  };

  const onSubmit = async (values: AddUserFormValues) => {
    const result = await addUser(buildAddUserPayload(values));
    if (result?.ok) {
      toast.success(result.message || "تم إضافة المستخدم بنجاح");
      await onSaved();
      handleClose();
      return;
    }
    toast.error(result?.message || "فشل إضافة المستخدم");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="md:max-w-[560px] rounded-2xl border-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      title="إضافة مستخدم"
      description="إنشاء حساب مستخدم جديد في النظام"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-1 text-right md:p-4">
        <UserFormFields errors={errors} register={register} setValue={setValue} watch={watch} />
        <UserFormActions submitLabel="إضافة المستخدم" isSubmitting={isSubmitting} onClose={handleClose} />
      </form>
    </Modal>
  );
}

export default UserAddModal;
