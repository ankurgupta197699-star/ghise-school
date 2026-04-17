import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";

const formSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  grade: z.string().min(1, "Please select a grade"),
  address: z.string().min(10, "Please provide a complete address"),
  previousSchool: z.string().optional(),
  studentBankAcc: z.string().min(10, "Please provide a valid bank account number"),
  aadharPhoto: z.any().optional(),
  passportPhoto1: z.any().optional(),
  passportPhoto2: z.any().optional(),
  fatherAadharPhoto: z.any().optional(),
  motherAadharPhoto: z.any().optional(),
  fatherPhoto1: z.any().optional(),
  fatherPhoto2: z.any().optional(),
  motherPhoto1: z.any().optional(),
  motherPhoto2: z.any().optional(),
  dobCertificate: z.any().optional(),
  message: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(data).forEach((key) => {
        if (key !== "terms" && !key.toLowerCase().includes("photo") && key !== "dobCertificate") {
          formData.append(key, (data as any)[key]);
        }
      });

      // Append files
      const fileFields = [
        "aadharPhoto", "passportPhoto1", "passportPhoto2", "fatherAadharPhoto", 
        "motherAadharPhoto", "fatherPhoto1", "fatherPhoto2", "motherPhoto1", "motherPhoto2", "dobCertificate"
      ];

      fileFields.forEach((field) => {
        const files = (data as any)[field];
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            formData.append(field, files[i]);
          }
        }
      });

      const response = await fetch("/api/admission", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send application");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(error instanceof Error ? error.message : "Failed to submit application. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-3xl font-serif font-bold text-school-navy mb-4">Application Received!</h3>
        <p className="text-slate-600 max-w-lg mb-8">
          Thank you! Your application has been successfully saved in our admission portal and a notification has been sent to the school administration. We will review it shortly.
        </p>
        <Button 
          onClick={() => setIsSuccess(false)}
          className="bg-school-navy text-white"
        >
          Submit Another Application
        </Button>
      </motion.div>
    );
  }

  return (
    <section id="admissions" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-school-navy mb-4">Admissions Open 2026-27</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto italic">
            "Your child's journey to excellence begins with a single step. Join the GHISE family today."
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
            <div className="bg-school-navy py-8 px-10 text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold">Registration Portal</h3>
                <p className="text-slate-300 text-sm mt-1">Enroll your child for a bright future</p>
              </div>
              <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-inner hidden sm:flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="School Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=GH&backgroundColor=008751&fontFamily=serif";
                  }}
                />
              </div>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-school-navy border-b pb-2">Student Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Full Name</Label>
                      <Input
                        id="studentName"
                        placeholder="John Doe"
                        {...register("studentName")}
                        className={errors.studentName ? "border-red-500" : ""}
                      />
                      {errors.studentName && (
                        <p className="text-xs text-red-500">{errors.studentName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentBankAcc">Student Bank Account Number</Label>
                      <Input
                        id="studentBankAcc"
                        placeholder="Enter account number"
                        {...register("studentBankAcc")}
                        className={errors.studentBankAcc ? "border-red-500" : ""}
                      />
                      {errors.studentBankAcc && (
                        <p className="text-xs text-red-500">{errors.studentBankAcc.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-school-navy border-b pb-2">Parent/Guardian Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent/Guardian Name</Label>
                      <Input
                        id="parentName"
                        placeholder="Jane Doe"
                        {...register("parentName")}
                        className={errors.parentName ? "border-red-500" : ""}
                      />
                      {errors.parentName && (
                        <p className="text-xs text-red-500">{errors.parentName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="parent@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-school-navy border-b pb-2">Academic Details</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Applying for Grade</Label>
                      <Select onValueChange={(val: string) => setValue("grade", val)}>
                        <SelectTrigger className={errors.grade ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pre-nursery">Pre Nursery</SelectItem>
                          <SelectItem value="nursery">Nursery</SelectItem>
                          <SelectItem value="lkg">LKG</SelectItem>
                          <SelectItem value="ukg">UKG</SelectItem>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                          <SelectItem value="4">Grade 4</SelectItem>
                          <SelectItem value="5">Grade 5</SelectItem>
                          <SelectItem value="6">Grade 6</SelectItem>
                          <SelectItem value="7">Grade 7</SelectItem>
                          <SelectItem value="8">Grade 8</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.grade && (
                        <p className="text-xs text-red-500">{errors.grade.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousSchool">Previous School (Optional)</Label>
                      <Input
                        id="previousSchool"
                        placeholder="Enter school name"
                        {...register("previousSchool")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Residential Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Full street address, city, state, zip"
                      {...register("address")}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-school-navy border-b pb-2">Document Uploads</h4>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Student Documents */}
                    <div className="space-y-6">
                      <h5 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Student Documents</h5>
                      <div className="space-y-2">
                        <Label>Student Photos (2 Photographs)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            id="passportPhoto1"
                            type="file"
                            accept="image/*"
                            {...register("passportPhoto1")}
                            className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                          />
                          <Input
                            id="passportPhoto2"
                            type="file"
                            accept="image/*"
                            {...register("passportPhoto2")}
                            className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">Upload 2 recent passport-sized color photographs separately.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadharPhoto">Student Aadhar Card Photo</Label>
                        <Input
                          id="aadharPhoto"
                          type="file"
                          accept="image/*"
                          {...register("aadharPhoto")}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dobCertificate">Student Date of Birth Certificate</Label>
                        <Input
                          id="dobCertificate"
                          type="file"
                          accept="image/*"
                          {...register("dobCertificate")}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                        />
                      </div>
                    </div>

                    {/* Parent Documents */}
                    <div className="space-y-6">
                      <h5 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Parent Documents</h5>
                      <div className="space-y-2">
                        <Label>Father's Photos (2 Photographs)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            id="fatherPhoto1"
                            type="file"
                            accept="image/*"
                            {...register("fatherPhoto1")}
                            className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                          />
                          <Input
                            id="fatherPhoto2"
                            type="file"
                            accept="image/*"
                            {...register("fatherPhoto2")}
                            className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Mother's Photos (2 Photographs)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            id="motherPhoto1"
                            type="file"
                            accept="image/*"
                            {...register("motherPhoto1")}
                            className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                          />
                          <Input
                            id="motherPhoto2"
                            type="file"
                            accept="image/*"
                            {...register("motherPhoto2")}
                            className="cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherAadharPhoto">Father's Aadhar Card Photo</Label>
                        <Input
                          id="fatherAadharPhoto"
                          type="file"
                          accept="image/*"
                          {...register("fatherAadharPhoto")}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherAadharPhoto">Mother's Aadhar Card Photo</Label>
                        <Input
                          id="motherAadharPhoto"
                          type="file"
                          accept="image/*"
                          {...register("motherAadharPhoto")}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-school-green/10 file:text-school-green hover:file:bg-school-green/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Any Additional Information</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your child's interests or special needs"
                    {...register("message")}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    onCheckedChange={(checked) => setValue("terms", !!checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions and certify that the information provided is accurate.
                    </label>
                    {errors.terms && (
                      <p className="text-xs text-red-500">{errors.terms.message}</p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-school-green hover:bg-school-green/90 text-white h-12 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t p-6 text-center">
              <p className="text-xs text-slate-500 w-full">
                By submitting this form, you agree to our privacy policy regarding the handling of student data.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
