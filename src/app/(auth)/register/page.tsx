import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
        <CardDescription>Create your Averzo account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
              <Label>Register as</Label>
              <RadioGroup defaultValue="customer" className="flex items-center space-x-4 pt-1">
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" />
                      <Label htmlFor="customer" className="font-normal">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="font-normal">Vendor</Label>
                  </div>
              </RadioGroup>
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
