package com.example.agent.service;

import com.example.agent.domain.Agent;
import com.example.agent.repository.AgentRepository;
import com.example.agent.web.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentService {
    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public List<Agent> listAll() {
        return agentRepository.findAll();
    }

    public Agent getById(Long id) {
        return agentRepository.findById(id).orElseThrow(() -> new NotFoundException("Agent not found: " + id));
    }

    public Agent create(Agent agent) {
        agent.setStatus(agent.getStatus() == null ? "ACTIVE" : agent.getStatus());
        return agentRepository.save(agent);
    }

    public Agent update(Long id, Agent updated) {
        Agent existing = getById(id);
        existing.setName(updated.getName());
        existing.setRole(updated.getRole());
        existing.setStatus(updated.getStatus());
        return agentRepository.save(existing);
    }

    public void delete(Long id) {
        agentRepository.delete(getById(id));
    }
}
