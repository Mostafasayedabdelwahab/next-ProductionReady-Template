import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/features/profile/profile.schema";
import type {
  UpdateProfileInput,
  ChangePasswordInput,
} from "@/features/profile/profile.types";
import {
  updateProfileAction,
  changePasswordAction,
} from "@/features/profile/profile.actions";
import { showError, showSuccess } from "@/lib/toast";
import { signOut } from "next-auth/react";
import { getDictionary } from "@/i18n/get-dictionary";
import { getErrorMessage } from "@/config/errors";
import { getSuccessMessage, SUCCESS_CODES } from "@/config/success";

export function useProfileForm(
  defaultValues: UpdateProfileInput,
  dict: Awaited<ReturnType<typeof getDictionary>>,
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
      image: defaultValues?.image ?? null,
    },
  });

  const onSubmit = (values: UpdateProfileInput) => {
    startTransition(async () => {
      const result = await updateProfileAction({
        ...values,
        name: values.name || null,
        phone: values.phone || null,
        address: values.address || null,
        image: values.image ?? null,
      });

      if (result.success) {
        showSuccess(getSuccessMessage(SUCCESS_CODES.PROFILE_UPDATED, dict));
        form.reset(values);
      } else {
        showError(getErrorMessage(result.code || "SERVER_ERROR", dict));
      }
    });
  };

  return { form, onSubmit, isPending };
}

export function useChangePasswordForm(
  dict: Awaited<ReturnType<typeof getDictionary>>,
  locale: string,
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordInput) => {
    startTransition(async () => {
      const result = await changePasswordAction(values);

      if (result.success) {
        showSuccess(getSuccessMessage(SUCCESS_CODES.PASSWORD_CHANGED, dict));

        form.reset();
        await signOut({ callbackUrl: `/${locale}/login` });
      } else {
        showError(getErrorMessage(result.code || "SERVER_ERROR", dict));
      }
    });
  };

  return { form, onSubmit, isPending };
}
