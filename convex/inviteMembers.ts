import React, { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';

export const InviteMemberForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const { organization } = useOrganization();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization) return;

        try {
            await organization.inviteMember({ emailAddress: email, role });
            setEmail('');
            setRole('');
            alert('Invitation sent successfully');
        } catch (error) {
            alert('Failed to send invitation: ' + error.message);
        }
    };

    return (
        <form onSubmit= { handleSubmit } >
        <input
        type="email"
    value = { email }
    onChange = {(e) => setEmail(e.target.value)}
placeholder = "Enter email address"
required
    />
    <input
        type="text"
value = { role }
onChange = {(e) => setRole(e.target.value)}
placeholder = "Enter role"
required
    />
    <button type="submit" > Send Invitation </button>
        </form>
  );
};