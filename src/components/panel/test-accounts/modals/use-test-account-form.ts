import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import type { TestAccountFormValues } from "@/schemas/test-accounts";
import { addTestAccount, editTestAccount } from "@/services/mutations";
import type { TestAccountListItem } from "@/types";

import {
  buildAddTestAccountPayload,
  buildChangedTestAccountPayload,
  hasPayloadEntries,
  testAccountDefaultValues,
  testAccountFormResolver,
  testAccountToFormValues,
} from "./test-account-form-utils";

type Options = {
  open: boolean;
  testAccount?: TestAccountListItem | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function useTestAccountForm({ open, testAccount, onClose, onSaved }: Options) {
  const isEdit = Boolean(testAccount);

  const form = useForm<TestAccountFormValues>({
    resolver: testAccountFormResolver(isEdit),
    defaultValues: testAccountDefaultValues,
    mode: "onChange",
  });

  const isActive = useWatch({ control: form.control, name: "is_active" });

  useEffect(() => {
    if (!open) {
      form.reset(testAccountDefaultValues);
      return;
    }
    form.reset(testAccount ? testAccountToFormValues(testAccount) : testAccountDefaultValues);
  }, [form, open, testAccount]);

  const close = () => {
    if (form.formState.isSubmitting) return;
    form.reset(testAccountDefaultValues);
    onClose();
  };

  const onSubmit = async (values: TestAccountFormValues) => {
    const result = testAccount
      ? await (() => {
          const payload = buildChangedTestAccountPayload(values, form.formState.dirtyFields);
          if (!hasPayloadEntries(payload)) return undefined;
          return editTestAccount(testAccount.id, payload);
        })()
      : await addTestAccount(buildAddTestAccountPayload(values));

    if (!result) {
      close();
      return;
    }

    if (!result.ok) {
      toast.error(result.message || "فشل حفظ حساب الاختبار");
      return;
    }

    toast.success(result.message || "تم حفظ حساب الاختبار بنجاح");
    form.reset(testAccountDefaultValues);
    onClose();
    await onSaved();
  };

  return { form, isEdit, isActive, close, onSubmit };
}
