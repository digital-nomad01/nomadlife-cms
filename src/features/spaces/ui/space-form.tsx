"use client";
import { useEffect, useState } from "react";
import { FormBuilder } from "@/app/core/form-builder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { spaceFields } from "@/features/spaces/domain/space-fields";
import { spaceSchema, type SpaceInput } from "@/features/spaces/domain/space-schema";
import { offerFields } from "@/features/spaces/domain/offer-fields";
import { offerSchema, type OfferInput } from "@/features/spaces/domain/offer-schema";
import { attractionFields } from "@/features/spaces/domain/attraction-fields";
import { attractionSchema, type AttractionInput } from "@/features/spaces/domain/attraction-schema";
import { useSpace, type SpaceRow } from "./use-space";
import { useOffer, type OfferRow } from "./use-offer";
import { useAttraction, type AttractionRow } from "./use-attraction";
import ImageGallery from "./image-gallery";

interface SpaceFormProps {
  spaceId?: string;
  onSuccess?: () => void;
}

const SpaceForm = ({ spaceId, onSuccess }: SpaceFormProps) => {
  const { handleSubmit, isLoading, getSpace, updateSpace, uploadImage } = useSpace();
  const { createOffer, updateOffer, deleteOffer, getOffers, isLoading: isOfferLoading } = useOffer();
  const { createAttraction, updateAttraction, deleteAttraction, getAttractions, isLoading: isAttractionLoading } = useAttraction();
  
  const [spaceData, setSpaceData] = useState<SpaceRow | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  
  // Offers state
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferRow | null>(null);

  // Attractions state
  const [attractions, setAttractions] = useState<AttractionRow[]>([]);
  const [showAttractionForm, setShowAttractionForm] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<AttractionRow | null>(null);

  useEffect(() => {
    if (spaceId) {
      setIsEdit(true);
      getSpace(spaceId).then((data) => {
        if (data) {
          setSpaceData(data);
          // Load offers and attractions for this space
          loadOffers(spaceId);
          loadAttractions(spaceId);
        }
      });
    }
  }, [spaceId]);

  const loadOffers = async (spaceId: string) => {
    const data = await getOffers(spaceId);
    setOffers(data);
  };

  const loadAttractions = async (spaceId: string) => {
    const data = await getAttractions(spaceId);
    setAttractions(data);
  };

  const handleFormSubmit = async (data: SpaceInput) => {
    if (isEdit && spaceId) {
      let imagePath = spaceData?.image;
      if (data.image) {
        imagePath = await uploadImage(data.image as File | undefined);
      }
      const result = await updateSpace(spaceId, {
        name: data.name,
        space_type: data.space_type,
        short_description: data.short_description,
        content: data.content ?? null,
        location: data.location,
        address: data.address ?? null,
        latitude: (data.latitude as number | null) ?? null,
        longitude: (data.longitude as number | null) ?? null,
        amenities: data.amenities ?? [],
        options: data.options ?? [],
        opening_time: data.opening_time ?? null,
        closing_time: data.closing_time ?? null,
        capacity: data.capacity ?? null,
        price_from: data.price_from ?? null,
        allow_booking: data.allow_booking ?? true,
        wifi_speed_mbps: data.wifi_speed_mbps ?? null,
        weather_condition: data.weather_condition ?? null,
        contact_email: data.contact_email ?? null,
        contact_phone: data.contact_phone ?? null,
        website: data.website ?? null,
        instagram: data.instagram ?? null,
        facebook: data.facebook ?? null,
        whatsapp: data.whatsapp ?? null,
        status: data.status,
        tags: data.tags ?? [],
        image: imagePath,
      });
      if (result && onSuccess) onSuccess();
    } else {
      if (data.image) {
        const imagePath = await uploadImage(data.image);
        if (imagePath) data.image = imagePath as unknown as File;
      }
      await handleSubmit(data);
      if (onSuccess) onSuccess();
    }
  };

  // Offer handlers
  const handleOfferSubmit = async (data: OfferInput) => {
    if (!spaceId) return;
    
    if (editingOffer) {
      const result = await updateOffer(editingOffer.id!, {
        name: data.name,
        description: data.description || null,
        price: data.price,
        currency: data.currency,
        capacity: data.capacity || null,
        available: data.available,
      });
      if (result) {
        await loadOffers(spaceId);
        setEditingOffer(null);
        setShowOfferForm(false);
      }
    } else {
      const result = await createOffer(spaceId, data);
      if (result) {
        await loadOffers(spaceId);
        setShowOfferForm(false);
      }
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!spaceId) return;
    if (confirm("Are you sure you want to delete this offer?")) {
      const success = await deleteOffer(offerId);
      if (success) {
        await loadOffers(spaceId);
      }
    }
  };

  // Attraction handlers
  const handleAttractionSubmit = async (data: AttractionInput) => {
    if (!spaceId) return;
    
    if (editingAttraction) {
      const result = await updateAttraction(editingAttraction.id!, {
        name: data.name,
        description: data.description || null,
        distance_km: data.distance_km,
        category: data.category || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        website: data.website || null,
      });
      if (result) {
        await loadAttractions(spaceId);
        setEditingAttraction(null);
        setShowAttractionForm(false);
      }
    } else {
      const result = await createAttraction(spaceId, data);
      if (result) {
        await loadAttractions(spaceId);
        setShowAttractionForm(false);
      }
    }
  };

  const handleDeleteAttraction = async (attractionId: string) => {
    if (!spaceId) return;
    if (confirm("Are you sure you want to delete this attraction?")) {
      const success = await deleteAttraction(attractionId);
      if (success) {
        await loadAttractions(spaceId);
      }
    }
  };

  const getDefaultValues = () => {
    if (spaceData) {
      return {
        name: spaceData.name,
        space_type: spaceData.space_type,
        short_description: spaceData.short_description,
        content: spaceData.content || "",
        location: spaceData.location,
        address: spaceData.address || "",
        latitude: spaceData.latitude ?? 0,
        longitude: spaceData.longitude ?? 0,
        amenities: spaceData.amenities || [],
        options: spaceData.options || [],
        opening_time: spaceData.opening_time || "",
        closing_time: spaceData.closing_time || "",
        capacity: spaceData.capacity || 0,
        price_from: spaceData.price_from || 0,
        allow_booking: spaceData.allow_booking ?? true,
        wifi_speed_mbps: spaceData.wifi_speed_mbps || 0,
        weather_condition: spaceData.weather_condition || "",
        contact_email: spaceData.contact_email || "",
        contact_phone: spaceData.contact_phone || "",
        website: spaceData.website || "",
        instagram: spaceData.instagram || "",
        facebook: spaceData.facebook || "",
        whatsapp: spaceData.whatsapp || "",
        status: spaceData.status,
        tags: spaceData.tags || [],
        image: spaceData.image,
      };
    }
    return {
      name: "",
      space_type: "coworking_space" as const,
      short_description: "",
      content: "",
      location: "",
      address: "",
      latitude: 0,
      longitude: 0,
      amenities: [],
      options: [],
      opening_time: "",
      closing_time: "",
      capacity: 0,
      price_from: 0,
      allow_booking: true,
      wifi_speed_mbps: 0,
      weather_condition: "",
      contact_email: "",
      contact_phone: "",
      website: "",
      instagram: "",
      facebook: "",
      whatsapp: "",
      status: "draft" as const,
      tags: [],
      image: undefined,
    };
  };

  const getAttractionDefaultValues = () => {
    if (editingAttraction) {
      return {
        name: editingAttraction.name,
        description: editingAttraction.description || "",
        distance_km: editingAttraction.distance_km,
        category: editingAttraction.category || "",
        latitude: editingAttraction.latitude || 0,
        longitude: editingAttraction.longitude || 0,
        website: editingAttraction.website || "",
      };
    }
    return {
      name: "",
      description: "",
      distance_km: 0,
      category: "",
      latitude: 0,
      longitude: 0,
      website: "",
    };
  };

  // Check if offers should be shown (only for coworking_space and coliving_space)
  const shouldShowOffers = spaceData?.space_type === 'coworking_space' || spaceData?.space_type === 'coliving_space';

  if (isEdit && !spaceData && isLoading) {
    return (
      <div className="w-full max-w-2xl">
        <div className="p-8 text-center">Loading space data...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Main Space Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Space Details</h2>
        <FormBuilder
          fields={spaceFields}
          schema={spaceSchema}
          onSubmit={handleFormSubmit}
          submitButtonText={
            isLoading
              ? (isEdit ? "Updating..." : "Creating...")
              : (isEdit ? "Update Space" : "Create Space")
          }
          defaultValues={getDefaultValues()}
        />
      </div>

      {/* Location & Contact Section - Show when editing */}
      {isEdit && spaceData && (
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-6">Location & Contact</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Address</h3>
              <p className="text-gray-700">
                {spaceData.address || spaceData.location}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Contact Information</h3>
              <div className="space-y-2">
                {spaceData.contact_phone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{spaceData.contact_phone}</span>
                  </div>
                )}
                {spaceData.contact_email && (
                  <div className="flex items-center gap-2">
                    <span>✉️</span>
                    <span>{spaceData.contact_email}</span>
                  </div>
                )}
                {spaceData.website && (
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <a href={spaceData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {spaceData.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Attractions Section */}
      {isEdit && spaceId && (
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Nearby Attractions</h2>
            <Button onClick={() => setShowAttractionForm(true)} disabled={showAttractionForm}>
              Add Attraction
            </Button>
          </div>

          {/* Add/Edit Attraction Form */}
          {showAttractionForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">
                {editingAttraction ? "Edit Attraction" : "Add New Attraction"}
              </h3>
              <FormBuilder
                fields={attractionFields}
                schema={attractionSchema}
                onSubmit={handleAttractionSubmit}
                submitButtonText={
                  isAttractionLoading
                    ? (editingAttraction ? "Updating..." : "Creating...")
                    : (editingAttraction ? "Update Attraction" : "Create Attraction")
                }
                defaultValues={getAttractionDefaultValues()}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setEditingAttraction(null);
                  setShowAttractionForm(false);
                }}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Attractions List */}
          {attractions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No nearby attractions added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {attractions.map((attraction) => (
                <div key={attraction.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <span>📍</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{attraction.name}</span>
                        <span className="text-sm text-gray-500">({attraction.distance_km}km)</span>
                        {attraction.category && (
                          <Badge variant="secondary" className="text-xs">
                            {attraction.category}
                          </Badge>
                        )}
                      </div>
                      {attraction.description && (
                        <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingAttraction(attraction);
                        setShowAttractionForm(true);
                      }}
                      disabled={showAttractionForm}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAttraction(attraction.id!)}
                      disabled={showAttractionForm}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Offers Section - Only show for coworking and coliving spaces */}
      {isEdit && spaceId && shouldShowOffers && (
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Available Offers</h2>
            <Button onClick={() => setShowOfferForm(true)} disabled={showOfferForm}>
              Add Offer
            </Button>
          </div>

          {/* Add/Edit Offer Form */}
          {showOfferForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">
                {editingOffer ? "Edit Offer" : "Add New Offer"}
              </h3>
              <FormBuilder
                fields={offerFields}
                schema={offerSchema}
                onSubmit={handleOfferSubmit}
                submitButtonText={
                  isOfferLoading
                    ? (editingOffer ? "Updating..." : "Creating...")
                    : (editingOffer ? "Update Offer" : "Create Offer")
                }
                defaultValues={editingOffer ? {
                  name: editingOffer.name,
                  description: editingOffer.description || "",
                  price: editingOffer.price,
                  currency: editingOffer.currency,
                  capacity: editingOffer.capacity || 1,
                  available: editingOffer.available,
                } : {
                  name: "",
                  description: "",
                  price: 0,
                  currency: "USD",
                  capacity: 1,
                  available: true,
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setEditingOffer(null);
                  setShowOfferForm(false);
                }}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Offers List */}
          {offers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No offers yet. Add your first offer to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{offer.name}</h4>
                        <Badge variant={offer.available ? "default" : "secondary"}>
                          {offer.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      {offer.description && (
                        <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">
                          {offer.price} {offer.currency}
                        </span>
                        {offer.capacity && (
                          <span>Capacity: {offer.capacity}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingOffer(offer);
                          setShowOfferForm(true);
                        }}
                        disabled={showOfferForm}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOffer(offer.id!)}
                        disabled={showOfferForm}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Gallery Section */}
      {isEdit && spaceId && (
        <div className="border-t pt-8">
          <ImageGallery spaceId={spaceId} />
        </div>
      )}

      {/* Info message for cafe spaces */}
      {isEdit && spaceData?.space_type === 'coworking_cafe' && (
        <div className="border-t pt-8">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Available Offers</h3>
            <p className="text-yellow-700">
              Offers are not available for cafe spaces. Contact for pricing information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceForm;



