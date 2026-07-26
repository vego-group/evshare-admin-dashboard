"use client";

import ContactUsContentShimmer from "./content-shimmer";
import ContactUsHeader from "./header";
import { useContactUsPage } from "./hooks/use-contact-us-page";
import { ContactUsFormModal } from "./modals";
import ContactUsResults from "./results";

function ContactUs() {
  const { data, isLoading, pendingEdit, setPendingEdit, refresh } =
    useContactUsPage();

  if (isLoading) {
    return <ContactUsContentShimmer />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ContactUsHeader />
      <ContactUsResults settings={data?.data ?? []} onEdit={setPendingEdit} />

      <ContactUsFormModal
        open={Boolean(pendingEdit)}
        setting={pendingEdit}
        onClose={() => setPendingEdit(null)}
        onSaved={refresh}
      />
    </div>
  );
}

export default ContactUs;
