import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getAllLevels, getAllCountries } from "@/services/dataService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useOnboarding } from "@/hooks/useOnboarding";

const OnboardingModal = ({ usedId, onComplete }) => {
  const [allLevels, setAllLevels] = useState<any[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [allCountries, setAllCountries] = useState<any[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [country, setCountry] = useState("");
  
  const { handleOnboardingSubmit } = useOnboarding(usedId, name, level, country);

  useEffect(() => {
    const fetchData = async () => {
      try {
    const levelcached = sessionStorage.getItem("allLevels");
    if (levelcached) {
      setAllLevels(JSON.parse(levelcached));
      setLoadingLevels(false);
    } else {
        const levelsData = await getAllLevels();
        setAllLevels(levelsData);
        sessionStorage.setItem("allLevels", JSON.stringify(levelsData));
        setLoadingLevels(false);
    }

    const countrycached = sessionStorage.getItem("allCountries");
    if (countrycached) {
      setAllCountries(JSON.parse(countrycached));
      setLoadingCountries(false);
    } else {
        const countriesData = await getAllCountries();
        setAllCountries(countriesData);
        sessionStorage.setItem("allCountries", JSON.stringify(countriesData));
        setLoadingCountries(false);
    }
  } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold">Complete Your Onboarding</h2>
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
        {/* Level Selection */}
        <div className="mt-4">
          <label className="block mb-2">What level are you studying at?</label>
          {loadingLevels ? (
            <div>Loading levels...</div>
          ) : (
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                {allLevels.map((lvl) => (
                  <SelectItem key={lvl.id} value={lvl.id} disabled={!lvl.launched}>
                    {lvl.name}
                    {!lvl.launched && (
                      <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Country Selection */}
        <div className="mt-4">
          <label className="block mb-2">Which country are you based in?</label>
          {loadingCountries ? (
            <div>Loading countries...</div>
          ) : (
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {allCountries.map((c) => (
                  <SelectItem key={c.id} value={c.id} disabled={!c.launched}>
                    {c.name}
                    {!c.launched && (
                      <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button className="mt-4 w-full" onClick={async () => {
    const success = await handleOnboardingSubmit();
    if (success) {
      onComplete();
    }
  }}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OnboardingModal;
