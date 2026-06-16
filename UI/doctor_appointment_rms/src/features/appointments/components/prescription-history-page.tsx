"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetClinicalNotesHistory } from "../hooks/use-my-appointment";
import { useUpdateClinicalNote } from "@/features/clinical-notes/hooks/use-clinical-notes";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  Pill,
  Calendar,
  ArrowLeft,
  Edit3,
  Save,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";

export function PrescriptionHistoryPage() {
  const { data: history, isLoading } = useGetClinicalNotesHistory();
  const { data: user } = useCurrentUser();
  const updateMutation = useUpdateClinicalNote();

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState("");

  const isDoctor = user?.role?.toLowerCase() === "doctor";

  const handleEditInit = (note: any) => {
    setEditForm(JSON.parse(JSON.stringify(note)));
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editForm?.id) return;

    try {
      await updateMutation.mutateAsync({
        clinicalNoteId: editForm.id,
        data: {
          diagnosis: editForm.diagnosis,
          observations: editForm.observations,
          treatmentSummary: editForm.treatmentSummary,
          followUpDate: editForm.followUpDate,
          followUpInstructions: editForm.followUpInstructions,
          medications: editForm.medications,
        },
      });

      setSelectedNote(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateMedication = (
    index: number,
    field: string,
    value: any
  ) => {
    const meds = [...editForm.medications];

    meds[index] = {
      ...meds[index],
      [field]: value,
    };

    setEditForm({
      ...editForm,
      medications: meds,
    });
  };

  const filteredHistory = history?.filter((note: any) => {
    if (!dateFilter) return true;

    const rawDate =
      note.createdAt ||
      note.date ||
      note.followUpDate;

    if (!rawDate) return false;

    return (
      new Date(rawDate)
        .toISOString()
        .split("T")[0] === dateFilter
    );
  });

  const groupedHistory =
    filteredHistory?.reduce(
      (acc: Record<string, any[]>, note: any) => {
        const rawDate =
          note.createdAt ||
          note.date ||
          note.followUpDate;

        const formattedDate = rawDate
          ? new Date(rawDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : "General History";

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }

        acc[formattedDate].push(note);

        return acc;
      },
      {}
    ) || {};

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Header */}

      <div className="flex items-center justify-between border-b pb-6 mb-6">
        <div className="flex items-center gap-3">
          {selectedNote && (
            <button
              onClick={() => {
                setSelectedNote(null);
                setIsEditing(false);
              }}
              className="p-2 rounded-full border hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <h1 className="text-3xl font-bold">
            {selectedNote
              ? "Consultation Details"
              : "Prescription History"}
          </h1>
        </div>

        {selectedNote &&
          isDoctor &&
          !isEditing && (
            <Button
              variant="outline"
              onClick={() =>
                handleEditInit(selectedNote)
              }
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Note
            </Button>
          )}
      </div>

      <div className="bg-slate-50 rounded-3xl border p-6 min-h-[600px]">
        {isLoading ? (
          <div className="text-center py-20">
            Loading records...
          </div>
        ) : isEditing ? (
          <div className="space-y-4 bg-white p-6 rounded-2xl border">
            <Input
              value={editForm.diagnosis}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  diagnosis: e.target.value,
                })
              }
            />

            <textarea
              className="w-full p-3 border rounded-xl"
              value={editForm.observations}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  observations: e.target.value,
                })
              }
            />

            <textarea
              className="w-full p-3 border rounded-xl"
              value={editForm.treatmentSummary}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  treatmentSummary: e.target.value,
                })
              }
            />

            {editForm.medications?.map(
              (med: any, idx: number) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-2"
                >
                  <Input
                    value={med.name}
                    onChange={(e) =>
                      updateMedication(
                        idx,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    value={med.dosage}
                    onChange={(e) =>
                      updateMedication(
                        idx,
                        "dosage",
                        e.target.value
                      )
                    }
                  />
                </div>
              )
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  setIsEditing(false)
                }
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>

              <Button
                onClick={handleUpdate}
                disabled={
                  updateMutation.isPending
                }
              >
                <Save className="mr-1 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border">
              <h4 className="text-xs text-gray-400 font-bold uppercase">
                Diagnosis
              </h4>

              <p className="font-bold text-lg">
                {selectedNote.diagnosis}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border">
              <h4 className="text-xs text-gray-400 font-bold uppercase mb-2">
                Observations
              </h4>

              <p>
                {selectedNote.observations}
              </p>

              <p className="mt-4 border-t pt-4">
                Treatment Plan:
                {" "}
                {selectedNote.treatmentSummary}
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <Pill size={18} />
                Medications
              </h4>

              {selectedNote.medications?.map(
                (med: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-slate-700 py-3"
                  >
                    <div>
                      <p className="font-bold">
                        {med.name}
                      </p>

                      <p className="text-xs opacity-70">
                        {med.instructions}
                      </p>
                    </div>

                    <span>
                      {med.dosage}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter */}

            <div className="bg-white border rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                Timeline Filters
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value
                    )
                  }
                  className="border rounded-xl p-2"
                />

                {dateFilter && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setDateFilter("")
                    }
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Timeline */}

            <div className="space-y-6 border-l-2 border-slate-200 pl-4">
              {Object.entries(
                groupedHistory
              ).map(
                ([date, items]: any) => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={14} />
                      <span className="font-bold text-sm">
                        {date}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {items.map(
                        (note: any) => (
                          <button
                            key={note.id}
                            onClick={() =>
                              setSelectedNote(
                                note
                              )
                            }
                            className="bg-white border rounded-2xl p-5 flex justify-between items-center hover:shadow-md"
                          >
                            <div>
                              <h4 className="font-bold">
                                {isDoctor
                                  ? note.patientName
                                  : note.doctorName}
                              </h4>

                              <p className="text-xs text-indigo-600 font-semibold">
                                {
                                  note.diagnosis
                                }
                              </p>
                            </div>

                            <ChevronRight
                              size={18}
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}