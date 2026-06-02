import ContactFaqSection from "@/components/Landing/ContactFaqSection";
import ContactFormSection from "@/components/Landing/ContactFormSection";
import ContactHeroSection from "@/components/Landing/ContactHeroSection";
import ContactInfoCardsSection from "@/components/Landing/ContactInfoCardsSection";
import { useContactPage } from "@/hooks/useContactPage";


export default function ContactPage() {
  const {
    storeInfo,
    isLoading,
    error,
    form,
    openFaq,
    submitted,
    errors,
    infoCards,
    setOpenFaq,
    onSubmit,
    setField,
  } = useContactPage();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ContactHeroSection storeInfo={storeInfo} />
      <ContactInfoCardsSection infoCards={infoCards} />
      <ContactFormSection
        storeInfo={storeInfo}
        submitted={submitted}
        errors={errors}
        form={form}
        setField={setField}
        onSubmit={onSubmit}
      />
      <ContactFaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
    </div>
  );
}
