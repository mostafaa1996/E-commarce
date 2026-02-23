import BaseSection from "@/Sections/UserProfile/BaseSectionForUserProfile";
import UserNestedRoutesHeader from "@/Sections/UserProfile/UserNestedRoutesHeader";
import ResetPasswordForm from "@/Sections/UserProfile/ResetPasswordForm";
import PreferencesSection from "@/Sections/UserProfile/PreferencesSection";
import { useState } from "react";
export default function UserSettingsPage({}) {
    const [isEditing, setIsEditing] = useState(false);
    function handleEdit() {
        setIsEditing(true);
    }
  return (
    <BaseSection>
      <UserNestedRoutesHeader iconName="settings" title="Settings" info="Mange your security and preferences" />
      <ResetPasswordForm title="Reset Password" />
      <PreferencesSection />
    </BaseSection>
  );
}