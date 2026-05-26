import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import ResetPasswordForm from "@/Sections/UserProfile/ResetPasswordForm";
import PreferencesSection from "@/Sections/UserProfile/PreferencesSection";

export default function UserSettingsPage() {
  return (
    <BaseSection>
      <UserNestedRoutesHeader iconName="settings" title="Settings" info="Mange your security and preferences" />
      <ResetPasswordForm title="Reset Password" />
      <PreferencesSection />
    </BaseSection>
  );
}
