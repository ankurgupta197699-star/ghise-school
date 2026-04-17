import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, AlertCircle, CheckCircle2, Loader2, HelpCircle, Trash2, Reply, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Query {
  id: string;
  name: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

export default function SupportSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedType, setSubmittedType] = useState<"query" | "complaint" | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch("/api/queries");
      const data = await response.json();
      setQueries(data);
    } catch (error) {
      console.error("Failed to fetch queries:", error);
    } finally {
      setIsLoadingQueries(false);
    }
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const question = (form.elements.namedItem("question") as HTMLTextAreaElement).value;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, question }),
      });
      if (response.ok) {
        setSubmittedType("query");
        fetchQueries();
        form.reset();
        setTimeout(() => setSubmittedType(null), 3000);
      }
    } catch (error) {
      console.error("Failed to submit query:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    setIsDeletingId(id);
    try {
      const response = await fetch(`/api/queries/${id}?adminKey=${adminKey}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchQueries();
      } else {
        console.error("Unauthorized or error deleting query");
      }
    } catch (error) {
      console.error("Failed to delete query:", error);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleAnswerQuery = async (id: string) => {
    try {
      const response = await fetch(`/api/queries/${id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText, adminKey }),
      });
      if (response.ok) {
        setAnsweringId(null);
        setAnswerText("");
        fetchQueries();
      } else {
        alert("Unauthorized or error saving answer");
      }
    } catch (error) {
      console.error("Failed to save answer:", error);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === "admin123") {
      setIsAdmin(true);
      setShowAdminLogin(false);
    } else {
      console.error("Invalid Admin Key");
      // You could add a small error message in the UI here
    }
  };

  return (
    <section id="support" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-school-green font-bold tracking-widest uppercase text-sm mb-4 block">
            Parent Support Center
          </span>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-school-navy">
              Public Query Desk
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className={isAdmin ? "text-school-green" : "text-slate-300"}
            >
              <Shield className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-slate-600 text-lg">
            Ask your doubts publicly. Our team and the community can see and learn from these discussions.
          </p>
        </div>

        {showAdminLogin && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="max-w-md mx-auto mb-12 overflow-hidden"
          >
            <Card className="border-2 border-school-navy/20">
              <CardContent className="p-6">
                <form onSubmit={handleAdminLogin} className="flex gap-4">
                  <Input 
                    type="password" 
                    placeholder="Enter Admin Key" 
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                  />
                  <Button type="submit" className="bg-school-navy text-white">Login</Button>
                </form>
                <p className="text-[10px] text-slate-400 mt-2">Default key is admin123</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12">
          {/* Query Form */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden sticky top-24">
              <CardHeader className="bg-school-navy text-white p-8">
                <CardTitle className="text-2xl font-serif">Ask a Question</CardTitle>
                <CardDescription className="text-slate-300">
                  Your question will be visible to everyone once submitted.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {submittedType === "query" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-12 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                    <h4 className="text-2xl font-bold text-school-navy mb-2">Submitted!</h4>
                    <p className="text-slate-600">Your query is now live on the desk.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitQuery} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Your Name</label>
                      <Input name="name" placeholder="Full Name" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Your Question</label>
                      <Textarea name="question" placeholder="What would you like to know?" className="min-h-[120px]" required />
                    </div>
                    <Button type="submit" className="w-full bg-school-navy hover:bg-school-navy/90 text-white h-12 font-bold text-lg">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : "Post Publicly"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Public Feed */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-school-navy flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-school-green" />
              Recent Discussions
            </h3>

            {isLoadingQueries ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-school-navy" />
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No queries yet. Be the first to ask!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {queries.map((query) => (
                    <motion.div
                      key={query.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-school-navy/10 rounded-full flex items-center justify-center text-school-navy font-bold">
                                {query.name[0].toUpperCase()}
                              </div>
                              <div>
                                <h5 className="font-bold text-school-navy">{query.name}</h5>
                                <p className="text-[10px] text-slate-400">
                                  {new Date(query.createdAt).toLocaleDateString()} at {new Date(query.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            {isAdmin && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                disabled={isDeletingId === query.id}
                                onClick={() => handleDeleteQuery(query.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                              >
                                {isDeletingId === query.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                          
                          <p className="text-slate-700 mb-6 pl-13">
                            {query.question}
                          </p>

                          {query.answer ? (
                            <div className="bg-school-green/5 border-l-4 border-school-green p-4 ml-13 rounded-r-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-school-green" />
                                <span className="text-xs font-bold text-school-green uppercase tracking-wider">School Response</span>
                              </div>
                              <p className="text-sm text-slate-600 italic">
                                "{query.answer}"
                              </p>
                            </div>
                          ) : (
                            isAdmin && (
                              <div className="ml-13">
                                {answeringId === query.id ? (
                                  <div className="space-y-3">
                                    <Textarea 
                                      placeholder="Type your response..." 
                                      value={answerText}
                                      onChange={(e) => setAnswerText(e.target.value)}
                                      className="text-sm"
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => handleAnswerQuery(query.id)}>Post Answer</Button>
                                      <Button size="sm" variant="ghost" onClick={() => setAnsweringId(null)}>Cancel</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-school-navy border-school-navy/20"
                                    onClick={() => setAnsweringId(query.id)}
                                  >
                                    <Reply className="w-4 h-4 mr-2" /> Reply as Admin
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
