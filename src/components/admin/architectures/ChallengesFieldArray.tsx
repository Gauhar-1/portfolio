'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Plus, Trash2, Sparkles, HelpCircle } from 'lucide-react';
import { VISUAL_KEY_OPTIONS, type ArchitectureFormValues } from '@/validations/architectureSchema';

interface ChallengesFieldArrayProps {
  form: UseFormReturn<ArchitectureFormValues>;
}

export function ChallengesFieldArray({ form }: ChallengesFieldArrayProps) {
  const { register, control, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'challenges',
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <LayoutGrid className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Section 03</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Bento Grid Challenges &amp; Deep Dives</CardTitle>
            <CardDescription>
              Architectural decisions presented as interactive Bento Box cards with slide-over drawers.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                id: `challenge-${fields.length + 1}`,
                title: '',
                teaser: '',
                problem: '',
                solution: '',
                impact: '',
                visualKey: 'chart',
              })
            }
            className="gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Bento Card
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {errors.challenges?.root && (
          <p className="text-xs text-destructive">{errors.challenges.root.message}</p>
        )}

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => {
              const itemErrors = errors.challenges?.[index];

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="relative rounded-2xl border border-border/80 bg-muted/15 p-5 sm:p-6 shadow-xs space-y-5"
                >
                  {/* Card Header Header Strip */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">
                        Challenge Card #{index + 1}
                      </span>
                      {index === 0 && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500 border border-emerald-500/20">
                          Hero Bento Card
                        </span>
                      )}
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Challenge</span>
                      </Button>
                    )}
                  </div>

                  {/* Row 1: ID, Visual Registry Key, Teaser */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Unique Key ID <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. scale, concurrency, auth"
                        {...register(`challenges.${index}.id` as const)}
                        className={itemErrors?.id ? 'border-destructive' : ''}
                      />
                      {itemErrors?.id && (
                        <p className="text-[11px] text-destructive">{itemErrors.id.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        Visual Registry Component <span className="text-destructive">*</span>
                      </Label>
                      <select
                        {...register(`challenges.${index}.visualKey` as const)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {VISUAL_KEY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {itemErrors?.visualKey && (
                        <p className="text-[11px] text-destructive">{itemErrors.visualKey.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Teaser Badge <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Edge SSR & Streaming Chunk Hydration"
                        {...register(`challenges.${index}.teaser` as const)}
                        className={itemErrors?.teaser ? 'border-destructive' : ''}
                      />
                      {itemErrors?.teaser && (
                        <p className="text-[11px] text-destructive">{itemErrors.teaser.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Card Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Card Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Scaling 5,000+ Menus Without Memory Bloat"
                      {...register(`challenges.${index}.title` as const)}
                      className={itemErrors?.title ? 'border-destructive' : ''}
                    />
                    {itemErrors?.title && (
                      <p className="text-[11px] text-destructive">{itemErrors.title.message}</p>
                    )}
                  </div>

                  {/* Row 3: Slide-over Drawer Content (Problem, Solution, Impact) */}
                  <div className="grid gap-4 md:grid-cols-3 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-rose-400">
                        The Problem <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        rows={4}
                        placeholder="Detailed technical bottleneck or vulnerability faced..."
                        {...register(`challenges.${index}.problem` as const)}
                        className={itemErrors?.problem ? 'border-destructive' : ''}
                      />
                      {itemErrors?.problem && (
                        <p className="text-[11px] text-destructive">{itemErrors.problem.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-emerald-400">
                        The Solution <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        rows={4}
                        placeholder="Architecture pattern or algorithm used to solve it..."
                        {...register(`challenges.${index}.solution` as const)}
                        className={itemErrors?.solution ? 'border-destructive' : ''}
                      />
                      {itemErrors?.solution && (
                        <p className="text-[11px] text-destructive">{itemErrors.solution.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-sky-400">
                        The Engineering Impact <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        rows={4}
                        placeholder="Quantifiable speedup, latency drop, or business result..."
                        {...register(`challenges.${index}.impact` as const)}
                        className={itemErrors?.impact ? 'border-destructive' : ''}
                      />
                      {itemErrors?.impact && (
                        <p className="text-[11px] text-destructive">{itemErrors.impact.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
