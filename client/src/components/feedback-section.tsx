import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, Zap, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FeedbackSection() {
  const [efficiency, setEfficiency] = useState([85]);
  const [clarity, setClarity] = useState([90]);
  const [innovation, setInnovation] = useState([80]);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    toast({
      title: "Feedback Submitted",
      description: "Your professional assessment has been recorded.",
    });
  };

  if (submitted) {
    return (
      <Card className="bg-card border-white/5 h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <ThumbsUp className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2">Assessment Recorded</h3>
        <p className="text-muted-foreground">Thank you for validating this digital asset.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-white/5">
      <CardHeader>
        <CardTitle className="font-display">Validate This Solution</CardTitle>
        <p className="text-sm text-muted-foreground">Rate this project based on professional metrics.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-500" /> Efficiency</Label>
              <span className="text-sm font-mono text-muted-foreground">{efficiency}%</span>
            </div>
            <Slider value={efficiency} onValueChange={setEfficiency} max={100} step={1} className="[&>.relative>.absolute]:bg-emerald-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Clarity</Label>
              <span className="text-sm font-mono text-muted-foreground">{clarity}%</span>
            </div>
            <Slider value={clarity} onValueChange={setClarity} max={100} step={1} className="[&>.relative>.absolute]:bg-amber-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Innovation</Label>
              <span className="text-sm font-mono text-muted-foreground">{innovation}%</span>
            </div>
            <Slider value={innovation} onValueChange={setInnovation} max={100} step={1} className="[&>.relative>.absolute]:bg-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea placeholder="Specific feedback on architecture or UX..." className="resize-none" />
        </div>

        <Button onClick={handleSubmit} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
          Submit Assessment
        </Button>
      </CardContent>
    </Card>
  );
}
