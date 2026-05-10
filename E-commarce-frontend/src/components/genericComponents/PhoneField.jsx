import InputField from "@/components/genericComponents/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/adminUI/select";

const DIAL_CODES = [
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+965", country: "Kuwait" },
  { code: "+974", country: "Qatar" },
  { code: "+973", country: "Bahrain" },
  { code: "+968", country: "Oman" },
  { code: "+962", country: "Jordan" },
  { code: "+961", country: "Lebanon" },
  { code: "+963", country: "Syria" },
  { code: "+964", country: "Iraq" },
  { code: "+212", country: "Morocco" },
  { code: "+213", country: "Algeria" },
  { code: "+216", country: "Tunisia" },
  { code: "+218", country: "Libya" },
  { code: "+20", country: "Egypt" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
];

function detectDialCode(phoneNumber) {
  const normalizedPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");

  if (!normalizedPhoneNumber.startsWith("+")) {
    return null;
  }

  return (
    DIAL_CODES.find(({ code }) => normalizedPhoneNumber.startsWith(code)) || null
  );
}

function getPhoneParts(phoneNumber) {
  const detectedDialCode = detectDialCode(phoneNumber);
  const selectedDialCode = detectedDialCode?.code || DIAL_CODES[0].code;
  const localNumber = detectedDialCode
    ? phoneNumber.slice(detectedDialCode.code.length).trim()
    : phoneNumber.replace(/[^\d\s()-]/g, "").trim();

  return {
    selectedDialCode,
    localNumber,
    detectedDialCode,
  };
}

function normalizePhoneNumber(dialCode, localNumber) {
  const cleanedLocalNumber = localNumber.replace(/[^\d\s()-]/g, "").trim();

  if (!cleanedLocalNumber) {
    return dialCode;
  }

  return `${dialCode} ${cleanedLocalNumber}`;
}

export default function PhoneField({ id, value, onChange, placeholder }) {
  const { selectedDialCode, localNumber, detectedDialCode } =
    getPhoneParts(value);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-2">
        <Select
          value={selectedDialCode}
          onValueChange={(dialCode) =>
            onChange({
              target: {
                value: normalizePhoneNumber(dialCode, localNumber),
              },
            })
          }
        >
          <SelectTrigger className="h-[50px] w-full shrink-0 px-3 text-sm">
            <span className="truncate font-medium">{selectedDialCode}</span>
          </SelectTrigger>
          <SelectContent>
            {DIAL_CODES.map(({ code, country }) => (
              <SelectItem key={code} value={code}>
                {code} {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="min-w-0">
          <InputField
            id={id}
            value={localNumber}
            onChange={(event) =>
              onChange({
                target: {
                  value: normalizePhoneNumber(
                    selectedDialCode,
                    event.target.value,
                  ),
                },
              })
            }
            placeholder={placeholder}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {detectedDialCode
          ? `Detected country key: ${detectedDialCode.country} (${detectedDialCode.code})`
          : "Choose the country key, then enter the phone number."}
      </p>
    </div>
  );
}
