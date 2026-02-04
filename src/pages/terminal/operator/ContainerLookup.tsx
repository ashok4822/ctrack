import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { operatorNavItems } from '@/config/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Container,
  MapPin,
  Truck,
  Calendar,
  Clock,
  FileText,
  Package,
} from 'lucide-react';
import { dummyContainers } from '@/data/dummyData';
import type { Container as ContainerType } from '@/types';
import { useState } from 'react';

export default function OperatorContainerLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContainer, setSelectedContainer] = useState<ContainerType | null>(null);
  const [searchResults, setSearchResults] = useState<ContainerType[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const results = dummyContainers.filter(c =>
      c.containerNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setHasSearched(true);

    if (results.length === 1) {
      setSelectedContainer(results[0]);
    } else {
      setSelectedContainer(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <DashboardLayout navItems={operatorNavItems} pageTitle="Container Lookup">
      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Container
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 max-w-xl">
            <Input
              placeholder="Enter container number (e.g., MSCU1234567)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && searchResults.length > 1 && !selectedContainer && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.map((container) => (
                <div
                  key={container.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedContainer(container)}
                >
                  <div className="flex items-center gap-3">
                    <Container className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{container.containerNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {container.size} • {container.type} • {container.shippingLine}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={container.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {hasSearched && searchResults.length === 0 && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Container className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Container Found</h3>
            <p className="text-muted-foreground">
              No container matches "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Container Details */}
      {selectedContainer && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" />
                Container Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{selectedContainer.containerNumber}</span>
                <StatusBadge status={selectedContainer.status} />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <p className="font-medium">{selectedContainer.size}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{selectedContainer.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Movement Type</Label>
                  <p className="font-medium capitalize">{selectedContainer.movementType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Weight</Label>
                  <p className="font-medium">{selectedContainer.weight ? `${selectedContainer.weight} kg` : 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Shipping Line</Label>
                  <p className="font-medium">{selectedContainer.shippingLine}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{selectedContainer.customer || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Seal Number</Label>
                  <p className="font-medium">{selectedContainer.sealNumber || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Damaged</Label>
                  <p className="font-medium">{selectedContainer.damaged ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <Label className="text-muted-foreground">Current Yard Location</Label>
                {selectedContainer.yardLocation ? (
                  <p className="text-xl font-bold mt-1">
                    {selectedContainer.yardLocation.block}
                  </p>
                ) : (
                  <p className="text-xl font-bold mt-1 text-muted-foreground">Not in Yard</p>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Gate-In Time</Label>
                    <p className="font-medium">
                      {selectedContainer.gateInTime
                        ? new Date(selectedContainer.gateInTime).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Gate-Out Time</Label>
                    <p className="font-medium">
                      {selectedContainer.gateOutTime
                        ? new Date(selectedContainer.gateOutTime).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <Label className="text-muted-foreground">Dwell Time</Label>
                    <p className="font-medium">
                      {selectedContainer.dwellTime ? `${selectedContainer.dwellTime} days` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <Truck className="mr-2 h-4 w-4" />
                  Process Gate-Out
                </Button>
                <Button variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Relocate Container
                </Button>
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Start Stuffing/Destuffing
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Lookups */}
      {!hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Containers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dummyContainers.slice(0, 5).map((container) => (
                <div
                  key={container.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedContainer(container);
                    setSearchQuery(container.containerNumber);
                    setHasSearched(true);
                    setSearchResults([container]);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Container className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{container.containerNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {container.size} • {container.type} • {container.shippingLine}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={container.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
