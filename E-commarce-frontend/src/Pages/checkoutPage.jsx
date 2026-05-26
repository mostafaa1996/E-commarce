import CartwithPaymentSection from "@/Sections/CheckOut/CartwithPaymentSection";
import TextArea from "@/components/genericComponents/TextArea";
import { Fragment } from "react";
import CheckoutPaymentSection from "@/Sections/CheckOut/placeOrderButtonSection";
import StripeElementsWrapper from "@/components/genericComponents/stripeElementWrapper";
import { SetUpPaymentMethods } from "@/APIs/UserProfileService";
import Loading from "@/components/genericComponents/Loading";
import AddressCard from "@/components/genericComponents/AddressCard";
import useUserAddressesPage from "@/hooks/useUserAddressesPage";
import ProfilePageState from "@/components/genericComponents/ProfilePageState";
import useCheckoutPage from "@/hooks/useCheckoutPage";
import Icon from "@/system/icons/Icon";

function CheckoutPanel({ title, description, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-light tracking-wide text-[#272727] sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function AddAddressTile({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[204px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center transition hover:border-[#FF6543] hover:bg-orange-50/40 active:scale-[0.99]"
    >
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-[#FF6543]">
        <Icon name="plus" size={22} strokeWidth={1.8} variant="primary" />
      </span>
      <span className="text-sm font-medium text-zinc-700">
        Add new address
      </span>
    </button>
  );
}

export default function CheckoutPage() {
  let content = null;
  const {
    checkoutData,
    isLoading,
    checkoutError,
    orderState,
    orderNotes,
    shippingDetailsModified,
    setNotes,
  } = useCheckoutPage();

  const {
    addresses,
    isLoadingAddresses,
    error: addressesError,
    defaultAddressId,
    handleEdit,
    handleGoToAddAddress,
    handleDelete,
    setAsDefault,
  } = useUserAddressesPage();

  function renderAddresses() {
    if (isLoadingAddresses) {
      return (
        <ProfilePageState
          type="loading"
          loadingMessage="Loading addresses"
        />
      );
    }

    if (addressesError) {
      return (
        <ProfilePageState
          type="error"
          title="Error loading addresses"
          message={addressesError.message}
        />
      );
    }

    if (addresses.length === 0) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <ProfilePageState
            title="No addresses found"
            message="Add an address to make checkout faster."
          />
          <AddAddressTile onClick={handleGoToAddAddress} />
        </div>
      );
    }

    const visibleAddresses = addresses.slice(0, 3);

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {visibleAddresses.map((address) => (
          <Fragment key={address._id}>
            <AddressCard
              type={address.label}
              isDefault={address._id === defaultAddressId}
              name={address.name}
              street={address.street}
              city={address.city}
              state={address.state}
              zip={address.zipCode}
              phone={address.phone}
              email={address.email}
              country={address.country}
              onEdit={() => handleEdit(address._id)}
              onSetDefault={() => {
                setAsDefault(address._id);
              }}
              onRemove={() => {
                handleDelete(address._id);
              }}
            />
          </Fragment>
        ))}
        <AddAddressTile onClick={handleGoToAddAddress} />
      </div>
    );
  }

  if (isLoading) {
    content = (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1600px] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Loading message="Loading checkout" />
      </div>
    );
  }

  if (checkoutError) {
    content = (
      <div className="mx-auto my-20 w-[90%] max-w-3xl">
        <ProfilePageState
          type="error"
          title="Error loading checkout"
          message={checkoutError.message}
        />
      </div>
    );
  }

  if (checkoutData) {
    content = (
      <main className="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#FF6543]">
            Secure checkout
          </p>
          <h1 className="text-3xl font-light tracking-wide text-[#272727] sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Review your delivery details, add order notes, and choose how you
            want to pay.
          </p>
        </div>

        <div className="grid gap-6 xl:gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <CheckoutPanel
              title="Delivery address"
              description="Choose the address that should receive this order."
            >
              {renderAddresses()}
            </CheckoutPanel>

            <CheckoutPanel
              title="Additional information"
              description="Add delivery notes or instructions for this order."
            >
              <TextArea
                placeholder="Notes about your order. Like special notes for delivery."
                onChange={setNotes}
                name="notes"
                className="min-h-32"
              />
            </CheckoutPanel>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            {checkoutData.cartMessage === "Cart found" &&
            checkoutData.cart ? (
              <CheckoutPanel
                title="Order summary"
                description="Confirm your cart totals and payment method."
              >
                <CartwithPaymentSection
                  cart={checkoutData.cart}
                  VAT_shipping={checkoutData.VAT_shipping}
                />
                <div className="mt-6 border-t border-zinc-200 pt-6">
                  <StripeElementsWrapper
                    open={orderState === "InProgress"}
                    getClientSecret={SetUpPaymentMethods}
                  >
                    {() => (
                      <CheckoutPaymentSection
                        cart={checkoutData.cart}
                        shippingDetailsModified={shippingDetailsModified}
                        orderNotes={orderNotes}
                      />
                    )}
                  </StripeElementsWrapper>
                </div>
              </CheckoutPanel>
            ) : (
              <ProfilePageState
                title={checkoutData.cartMessage || "Cart not found"}
                message="Add products to your cart before checking out."
              />
            )}
          </aside>
        </div>
      </main>
    );
  }

  return <>{content}</>;
}
