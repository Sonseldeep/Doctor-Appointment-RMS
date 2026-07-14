"use client";

import { useState } from "react";
import { useGetPatients } from "../hooks/use-get-patients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  RiLoader2Line, 
  RiArrowLeftSLine, 
  RiArrowRightSLine,
  RiSearchLine,
  RiMapPinLine,
  RiGenderlessLine,
  RiFilter3Line,
  RiUser3Line
} from "@remixicon/react";

export function UserManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sex, setSex] = useState<string>("all");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [address, setAddress] = useState("");

  const { data, isLoading, isFetching } = useGetPatients({
    Page: page,
    PageSize: 10,
    SearchTerm: searchTerm || undefined,
    Sex: sex !== "all" ? sex : undefined,
    MinAge: minAge ? parseInt(minAge, 10) : undefined,
    MaxAge: maxAge ? parseInt(maxAge, 10) : undefined,
    Address: address || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Shadcn Card for Filtering Engine */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-800">
            <RiFilter3Line size={18} className="text-blue-600" />
            Filter Patients
          </CardTitle>
          {/* <CardDescription>
            Narrow down administrative search parameters on system user registries.
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                value={searchTerm}
                className="pl-9 bg-muted/30 focus-visible:bg-background transition"
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            
            {/* Sex Select Wrapper */}
            <div className="relative">
              <Select value={sex} onValueChange={(val) => { setSex(val); setPage(1); }}>
                <SelectTrigger className="bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RiGenderlessLine size={16} />
                    <SelectValue placeholder="Select Sex" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Age Field */}
            <Input
              type="number"
              placeholder="Min Age"
              value={minAge}
              className="bg-muted/30"
              onChange={(e) => { setMinAge(e.target.value); setPage(1); }}
            />

            {/* Max Age Field */}
            <Input
              type="number"
              placeholder="Max Age"
              value={maxAge}
              className="bg-muted/30"
              onChange={(e) => { setMaxAge(e.target.value); setPage(1); }}
            />

            {/* Location Field */}
            <div className="relative">
              <RiMapPinLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter by Address"
                value={address}
                className="pl-9 bg-muted/30 focus-visible:bg-background transition"
                onChange={(e) => { setAddress(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shadcn Card wrapping the Core Data Table Grid */}
      <Card className="overflow-hidden relative">
        {isFetching && (
          <div className="absolute right-6 top-4 text-blue-600 animate-spin z-10">
            <RiLoader2Line size={20} />
          </div>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold h-12">Name</TableHead>
                  <TableHead className="font-semibold h-12">Email Address</TableHead>
                  <TableHead className="font-semibold h-12">Sex</TableHead>
                  <TableHead className="font-semibold h-12">Age</TableHead>
                  <TableHead className="font-semibold h-12">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <RiLoader2Line className="animate-spin inline-block mr-2 text-blue-600" size={20} />
                      Fetching user system directories...
                    </TableCell>
                  </TableRow>
                ) : data?.items && data.items.length > 0 ? (
                  data.items.map((patient: any) => {
                    // 1. Resolve nested account relationship structure cleanly
                    const account = patient.user || patient;

                    // 2. Combine names safely from the verified account layer
                    const fullName = account.firstName || account.lastName
                      ? `${account.firstName || ""} ${account.lastName || ""}`.trim()
                      : "";

                    // 3. Fallback variables for tracking keys, assets, and identity
                    const recordKey = patient.id || patient.patientProfileId || account.id;
                    const avatarUrl = account.profilePhotoUrl || null;
                    const displayEmail = account.email || patient.email || "—";

                    return (
                      <TableRow key={recordKey} className="hover:bg-muted/20 transition">
                        <TableCell className="font-medium py-3">
                          <div className="flex items-center gap-3">
                            {/* Dynamic Photo Avatar Container */}
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold border border-muted flex-shrink-0">
                              {avatarUrl ? (
                                <img 
                                  src={avatarUrl} 
                                  alt={fullName || "User profile"} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="uppercase">
                                  {fullName ? fullName.charAt(0) : <RiUser3Line size={15} />}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-900 font-semibold">
                              {fullName || "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3">
                          {displayEmail}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            patient.sex === "Male" 
                              ? "bg-blue-50 text-blue-700 border-blue-100" 
                              : "bg-pink-50 text-pink-700 border-pink-100"
                          }`}>
                            {patient.sex || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-foreground font-medium py-3">
                          {patient.age ? `${patient.age} yrs` : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate py-3" title={patient.address}>
                          {patient.address || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                      No registered platform accounts found matching those filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Dynamic Shadcn Footer Component for Pagination Controls */}
        {data && data.totalPages > 1 && (
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing Page <span className="font-semibold text-foreground">{data.page}</span> of{" "}
              <span className="font-semibold text-foreground">{data.totalPages}</span> ({data.totalCount} total users)
            </p>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-background shadow-sm"
              >
                <RiArrowLeftSLine size={16} className="mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
                disabled={page === data.totalPages}
                className="bg-background shadow-sm"
              >
                Next <RiArrowRightSLine size={16} className="ml-1" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}