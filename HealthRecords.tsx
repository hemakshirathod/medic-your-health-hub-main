import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Download, Search, Calendar } from 'lucide-react';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { HealthRecord } from '@/types';

const HealthRecords = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'Lab Report' as HealthRecord['type'],
    title: '',
    description: '',
    provider: '',
    fileName: '',
    fileData: '',
  });

  const recordTypes = ['All', 'Lab Report', 'Prescription', 'Discharge Summary', 'Radiology', 'Other'];

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setRecords(storage.getHealthRecords(currentUser.id));
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecord({
          ...newRecord,
          fileName: file.name,
          fileData: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.title || !newRecord.provider || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    const record: HealthRecord = {
      id: `rec_${Date.now()}`,
      userId: user.id,
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      provider: newRecord.provider,
      fileName: newRecord.fileName,
      fileData: newRecord.fileData,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedRecords = [...records, record];
    storage.setHealthRecords(user.id, updatedRecords);
    setRecords(updatedRecords);
    
    setNewRecord({
      type: 'Lab Report',
      title: '',
      description: '',
      provider: '',
      fileName: '',
      fileData: '',
    });
    setIsDialogOpen(false);
    toast.success('Health record added successfully!');
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Health Records</h1>
            <p className="text-lg text-muted-foreground">Manage your medical documents and history</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>Upload a new medical document or report</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type</Label>
                  <Select
                    value={newRecord.type}
                    onValueChange={(value) => setNewRecord({ ...newRecord, type: value as HealthRecord['type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lab Report">Lab Report</SelectItem>
                      <SelectItem value="Prescription">Prescription</SelectItem>
                      <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                      <SelectItem value="Radiology">Radiology</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete Blood Count"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Healthcare Provider *</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., City Hospital"
                    value={newRecord.provider}
                    onChange={(e) => setNewRecord({ ...newRecord, provider: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional notes or findings..."
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  {newRecord.fileName && (
                    <p className="text-sm text-muted-foreground">Selected: {newRecord.fileName}</p>
                  )}
                </div>
                <Button className="w-full" onClick={handleAddRecord}>
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records by title or provider..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {recordTypes.map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {records.length === 0 ? 'No health records yet. Upload your first record!' : 'No records found matching your search.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{record.title}</CardTitle>
                      <CardDescription className="text-xs">{record.type}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="text-sm font-medium">{record.provider}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {record.date}
                  </div>
                  {record.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{record.description}</p>
                  )}
                  {record.fileName && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        if (record.fileData) {
                          const link = document.createElement('a');
                          link.href = record.fileData;
                          link.download = record.fileName || 'document';
                          link.click();
                        }
                      }}
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthRecords;
