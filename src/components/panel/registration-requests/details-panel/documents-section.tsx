import type { RegistrationRequest } from "@/types";
import DocumentRow from "./document-row";
import PanelSectionTitle from "./panel-section-title";

function DocumentsSection({ request }: { request: RegistrationRequest }) {
  return (
    <section className="space-y-4">
      <PanelSectionTitle>الوثائق المطلوبة</PanelSectionTitle>
      <div className="space-y-3 rounded-[14px] bg-background p-5">
        {request.documentsList.map((document) => (
          <DocumentRow
            key={document.id}
            label={document.label}
            complete={document.complete}
          />
        ))}
      </div>
    </section>
  );
}

export default DocumentsSection;
